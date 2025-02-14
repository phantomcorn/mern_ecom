/*
    PREV: /routes/authRoute.js
    NEXT: return result to frontend as JSON object

    This is where the backend logic happens
*/

import asyncHandler from 'express-async-handler'
import Account from "../models/accountModel.js"
import validateEmail from '../utils/validateEmail.js'
import sendEmail from '../utils/sendEmail.js'
// Hash function
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"

// @route POST /api/auth/create
const create = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) return res.status(400).send({message: "A field is currently missing"})
    if (!validateEmail(email)) return res.status(400).send({message: "The email you have provided is not in the correct format"})
    
    let user = await Account.findOne({email: email})
    if (user) return res.status(409).send({message: "Email already taken"})
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    //create new account
    const newAccount = await Account.create({
        email, 
        password: hashedPassword,
        didVerify: false
    })

    const verificationToken = newAccount.getVerificationToken()
    const verificationLink = `${process.env.VITE_APP_BASE_URL}/verify-email?id=${newAccount._id}&verifyToken=${verificationToken}`
    await sendEmail(email, verificationLink)
    //save account details to mongoDB  
    newAccount.save()
    //return result to frontend
    res.status(200).send({
        email: email,
        message: "Account succesfully registered, please verify your email"
    })
    
})

// @route POST /api/auth/verify-email
const verifyEmail = asyncHandler(async (req, res) => {
    const { id, verifyToken } = req.body;
    if (!id || !verifyToken) return res.status(400).json({message: "Missing verify email parameters"})

    const hashedToken = crypto.createHash("sha256").update(verifyToken).digest("hex")

    const user = await Account.findOne({
        _id: id,
        verifyToken: hashedToken,
        verifyTokenExpire: {$gt: new Date()} //verification token not expired
    })

    if (!user) return res.status(403).send({message: "Invalid or expired token"})
    user.didVerify = true
    user.verifyToken = undefined
    user.verifyTokenExpire = undefined
    await user.save()
        
    res.status(200).send({message: "Email verified succesfully"})
    
})

// @route POST /api/auth/
const login = asyncHandler(async (req,res) => {

    const {email, password} = req.body
    if (!email || !password) return res.status(400).send({message: "A field is currently missing"})
    if (!validateEmail(email)) return res.status(400).send({message: "The email you have provided is not in the correct format"})

    let user = await Account.findOne({email: email})
    if (!user) return res.status(404).send({message: "No account associated with the provided email"})
    
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).send({message: "Incorrect password"})

    //login credentials matched
    if (!user.didVerify) { //user has not verified their email
        if (Date.now() > user.verifyTokenExpire) { //if verification link expired
            const verificationToken = user.getVerificationToken()
            const verificationLink = `${process.env.VITE_APP_BASE_URL}/verify-email?id=${user._id}&verifyToken=${verificationToken}`
            await sendEmail(email, verificationLink)
            //update account details to mongoDB  
            user.save()
            return res.status(200).send({email: user.email, didVerify: user.didVerify, message: "We have sent you a new email verification, please verify them before you can use your account"})
        } else { //email not verified (not expired)
            return res.status(200).send({email: user.email, didVerify: user.didVerify, message: "Email not verified"})
        }   
    } 
        
    //create(encode) access token
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "user": user.email
            }

        },  
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
    )

    //create(encode) refresh token
    const refreshToken = jwt.sign(
        {"user": user.email},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "6h" } //expiry used to check against jwt.verify()
    )

    //set cookie name 'jwt' as refreshToken with the following cookie options
    //this will be use when access token expires and we call `refresh`
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //use https protocol
        sameSite: "none", //cross-site cookie
        maxAge: 6 * 60 * 60 * 1000//set to match refreshToken expiry (6h in ms)
    })

    //user did verify their email => login as normal
    res.status(200).json({
        email: user.email, 
        didVerify: user.didVerify, //true
        token: accessToken//send access token to be use for subsequent API calls
    })  
})

// @route GET /api/auth/refresh
const refresh = (req,res) => { 

    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).send({message: "Unauthorized (No cookies)"})

    //retrieve the refresh token that was stored in the cookie back from our intial login
    const refreshToken = cookies.jwt

    /*  
        Decode refresh token and compare against REFRESH_TOKEN_SECRET
        If valid, we get back the original payload content use to create our refresh token
        and we generate a new access token
    */
    jwt.verify(refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).send({message: "Forbidden (Invalid refresh token)"})
            const user = await Account.findOne({email: decoded.user})

            if (!user) return res.status(401).send({message: "Unauthorized (No user found)"})
            //refresh token valid => create new access token
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "user": user.email
                    }
        
                },  
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            )

            res.json({ token: accessToken })
        })
    )
}

// @route POST /api/auth/logout
// If exist, clear browser's jwt cookie
const logout = (req,res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(204).json({message: "No content"})
    res.clearCookie('jwt', {httpOnly: true, sameSite: "none", secure: true})
    res.status(200).json({ message: "Cookies cleared"})
}


export {create, verifyEmail, login, refresh, logout}