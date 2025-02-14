/*
    Mongoose allows you to model data in MongoDB as object to help with types
*/

import mongoose from "mongoose"
import crypto from "crypto"

//model for database
const accountSchema = new mongoose.Schema({
    email : {type: String , required: true, unique: true},
    password : {type: String, required: true},
    didVerify: {type: Boolean, required: true},
    verifyToken: {type: String},
    verifyTokenExpire: {type: Date}},
{
    methods: {
        getVerificationToken() {
            const verificationToken = crypto.randomBytes(20).toString("hex")
            this.verifyToken = crypto.createHash("sha256").update(verificationToken).digest("hex")
        
            this.verifyTokenExpire = new Date(Date.now() + 30 * 60 * 1000)
        
            return verificationToken
        }
    }
})

//REST API on ThreadsDB.accounts
const Account = mongoose.model("accounts", accountSchema)

export default Account;