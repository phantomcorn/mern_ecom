/*
    Mongoose allows you to model data in MongoDB as object to help with types
*/

import mongoose from "mongoose"

//model for database
const accountSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    user: {type: String, required: true, unique: true},
    pass: {type: String, required: true},
    otp: {type: String, default: null}
})

//REST API on ThreadsDB.adminAccounts
const AdminAccount = mongoose.model("adminAccount", accountSchema)

export default AdminAccount;