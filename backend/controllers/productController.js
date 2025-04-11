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

// @router GET /api/product/:productId
const getById = asyncHandler(async (req, res) => {
    const {productId} = req.params
    const product = await Product.findOne({_id: productId}) //get all products
    
    //return result to frontend
    if (!product) {
        return res.status(404).send({message: "Product not found"})
    }

    res.status(200).send({
        product
    })
})




export { getAll, getById }