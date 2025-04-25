/*
    PREV: /routes/admin/AuthRoute.js
    NEXT: return result to frontend as JSON object

    This is where the backend logic happens
*/

import asyncHandler from 'express-async-handler'
import jwt from "jsonwebtoken"
import Product from '../../models/productModel.js'
import bcrypt from "bcrypt"
// @route POST /api/admin/product/add
const add = asyncHandler(async (req, res) => {
    console.log("adding product")
    return res.status(200).json({})
})

// @route POST /api/admin/product/delete
const remove = asyncHandler(async (req, res) => {
    console.log("Remove")

    return res.status(200).json({})
})


//@route POST /api/admin/product/update
const updateQuantity = (req, res) => { 
    console.log("update")
    return res.status(200).json({})
}


export {add, remove, updateQuantity}