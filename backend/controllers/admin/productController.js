/*
    PREV: /routes/admin/AuthRoute.js
    NEXT: return result to frontend as JSON object

    This is where the backend logic happens
*/

import asyncHandler from 'express-async-handler'
import jwt from "jsonwebtoken"
import Product from '../../models/productModel.js'
import bcrypt from "bcrypt"
import stripe from '../../db/stripe.js'
// @route POST /api/admin/product/add
const add = asyncHandler(async (req, res) => {
    console.log("adding product")

    const {name, quantity, price, description, tax_code} = req.body
    console.log(req.body)
    const productObj = await stripe.products.create({
        name,
        description,
        tax_code
    })
    if (!productObj) return res.status(401).json({message: "Couldn't create product (Stripe)"})
    const priceObj = await stripe.prices.create({
        currency: "gbp",
        unit_amount: price * 100,
        product: productObj.id
    })
    if (!priceObj) return res.status(401).json({message: "Couldn't create pricing (Stripe)"})

    // For inventory
    await Product.create({
        productId: productObj.id,
        priceId: priceObj.id,
        name,
        quantity
    })

    return res.status(200).json({message: "Product created!"})
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