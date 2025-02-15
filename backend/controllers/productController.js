import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @route GET /api/product
const getAll = asyncHandler(async (req, res) => {

    const products = await Product.find({}) //get all products
    //return result to frontend
    res.status(200).send({
        products
    })
    
})

export { getAll }