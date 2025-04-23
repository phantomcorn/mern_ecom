/*
    PREV: /routes/admin/AuthRoute.js
    NEXT: return result to frontend as JSON object

    This is where the backend logic happens
*/

import asyncHandler from 'express-async-handler'
import {sendAdminEmail} from '../../utils/sendEmail.js'
import { generateOTP, verifyOTP } from '../../utils/otp.js'
import jwt from "jsonwebtoken"
import AdminAccount from '../../models/adminAccountModel.js'
import bcrypt from "bcrypt"
// @route POST /api/admin/auth/login
const login = asyncHandler(async (req, res) => {
    const {user, pass} = req.body
    if (!user || !pass) return res.status(400).send({message: "Parameter missing"})
    
    const acc = await AdminAccount.findOne({user})
    if (!acc) return res.status(400).send({message: "No account found"})
    
    const match = await bcrypt.compare(pass, acc.pass)
    if (!match) return res.status(400).send({message: "Incorrect password"})

    const otp = generateOTP()
    sendAdminEmail(otp)

    await AdminAccount.findOneAndUpdate(
        acc,
        { $set: { otp } },
    )

    //return result to frontend
    res.status(200).send({
        message: `OTP sent to admin email`
    })
    
})

// @route POST /api/admin/auth/verify
const verify = asyncHandler(async (req, res) => {
    const { user, otp } = req.body;
    if (!otp) return res.status(400).json({message: "Missing parameter"})

    const query = await AdminAccount.findOne({user})
    if (!query) return res.status(403).send({message: "Session does not exist or expired"})

    const verified = verifyOTP(otp)
    if (!verified) return res.status(401).send({message: "Incorrect code"})

    if (otp !== query.otp) return res.status(403).send({message: "Session does not exist or expired"})

    await AdminAccount.findOneAndUpdate(
        query,
        { $set : { otp: null }}
    )
    /* Successful => generate access token */
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "user": user,
                "admin": true
            },
        },  
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
    )

    //create(encode) refresh token
    const refreshToken = jwt.sign(
        {"user": user},
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

    res.status(200).send({message: "Verified", token: accessToken})
})


//@route GET /api/admin/auth/refresh
const refresh = (req, res) => { 

    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(403).send({message: "Your login session has expired."})

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
                        "user": decoded.user,
                        "admin": true
                    }
        
                },  
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            )

            res.json({ token: accessToken })
        })
    )
}

// @route POST /api/admin/auth/logout
// If exist, clear browser's jwt cookie
const logout = (req,res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(204).json({message: "No content"})
    res.clearCookie('jwt', {httpOnly: true, sameSite: "none", secure: true})
    res.status(200).json({ message: "Cookies cleared"})
}


export {login, verify, refresh, logout}