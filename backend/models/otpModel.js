/*
    Mongoose allows you to model data in MongoDB as object to help with types
*/

import mongoose from "mongoose"

//model for database
const otpSchema = new mongoose.Schema({
    otp: {type: String, required: true, unique: true},
    email: {type: String, required:true, unique: true},
    createdAt: {type: Date, default: Date.now, expires: 300}
})

//REST API on ThreadsDB.otp
const Otp = mongoose.model("otp",otpSchema)

export default Otp;