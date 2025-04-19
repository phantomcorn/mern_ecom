/*
    PREV: /routes/authRoute.js
    NEXT: return result to frontend as JSON object

    This is where the backend logic happens
*/

import asyncHandler from 'express-async-handler'
import validateEmail from '../utils/validateEmail.js'
import sendEmail from '../utils/sendEmail.js'

import jwt from "jsonwebtoken"
import { generateOTP, verifyOTP } from '../utils/otp.js'
import Otp from '../models/otpModel.js'

// @route POST /api/auth/create
const create = asyncHandler(async (req, res) => {
    const {email} = req.body
    if (!email) return res.status(400).send({message: "No email provided"})
    if (!validateEmail(email)) return res.status(400).send({message: "The email you have provided is not in the correct format"})
    
    // Check if user has any completed session => if not, no user found
    /* TO BE IMPLEMENTED */
    
    const otp = generateOTP()
    await sendEmail(email, otp)

    await Otp.create({
        otp,
        email
    })

    //return result to frontend
    res.status(200).send({
        message: `OTP sent to ${email}`
    })
    
})

// @route POST /api/auth/verify
const verify = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!otp) return res.status(400).json({message: "Missing parameter"})

    const query = await Otp.findOne({email, otp})
    if (!query) return res.status(404).send({message: "Erorr verifying OTP (no account found)"})
    
    const verified = verifyOTP(otp)
    if (!verified) return res.status(403).send({message: "Incorrect code"})
    
    /* Successful => generate access token */
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": email
            }

        },  
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
    )

    //create(encode) refresh token
    const refreshToken = jwt.sign(
        {"email": email},
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

    // delete otp entry once used
    await query.deleteOne()

    res.status(200).send({message: "Verified", token: accessToken})
})


//@route GET /api/auth/refresh
const refresh = asyncHandler(async (req, res) => { 

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
            
            //refresh token valid => create new access token
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email
                    }
        
                },  
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            )

            res.json({ token: accessToken })
        })
    )
})

// // @route POST /api/auth/logout
// // If exist, clear browser's jwt cookie
// const logout = (req,res) => {
//     const cookies = req.cookies
//     if (!cookies?.jwt) return res.status(204).json({message: "No content"})
//     res.clearCookie('jwt', {httpOnly: true, sameSite: "none", secure: true})
//     res.status(200).json({ message: "Cookies cleared"})
// }


export {create, verify, refresh}