/*
    Mongoose allows you to model data in MongoDB as object to help with types
*/

import mongoose from "mongoose"

//model for database
const productSchema = new mongoose.Schema({
    productId : {type: String , required: true},
    priceId: {type: String, required: true},
    name : {type: String, required: true},
    quantity: {type: Number, required: true},
})

//REST API on ThreadsDB.products (Inventory keepsake)
const Product = mongoose.model("product", productSchema)

export default Product;