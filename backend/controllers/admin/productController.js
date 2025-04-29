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

const getProducts = asyncHandler(async (req,res) => {
    const products = await Product.find({})
    if (!products) return res.status(401).json({message: "Could not retrieve product"})

    return res.status(200).json({products})
})

// @route POST /api/admin/product/add
const add = asyncHandler(async (req, res) => {
    console.log("adding product")

    const {name, quantity, price, description, tax_code} = req.body
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
    const {id} = req.body
    const prod = await Product.findOneAndDelete({productId: id})
    if (!prod) return res.status(401).json({message: "Error removing product"})
        
    await stripe.prices.update(
        prod.priceId,
        {active: false}
    )
    await stripe.products.update(
        prod.productId,
        {active: false}
    )

    return res.status(200).json({message: "Product deleted"})
})


//@route POST /api/admin/product/update
const updateQuantity = asyncHandler(async (req, res) => { 
    console.log("update")
    const {id, quantity} = req.body
    
    const update = await Product.findOneAndUpdate(
        {productId: id},
        {quantity}
    )

    if (!update) return res.status(401).json({message: `Could not find product with id ${id}`})

    return res.status(200).json({message: "Update succesfully"})
})


export {add, remove, updateQuantity, getProducts}