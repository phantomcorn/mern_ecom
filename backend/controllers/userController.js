import asyncHandler from 'express-async-handler'
import Account from '../models/accountModel.js'

// @route GET /api/user
const get = asyncHandler(async (req, res) => {

    const user = await Account.findOne({email: req.email})
    //return result to frontend
    res.status(200).send({
        email: user.email,
        didVerify: user.didVerify
    })
    
})

export { get }