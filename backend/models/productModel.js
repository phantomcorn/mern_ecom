/*
    Mongoose allows you to model data in MongoDB as object to help with types
*/

import mongoose from "mongoose"

//model for database
const productSchema = new mongoose.Schema({
    name : {type: String , required: true},
    description : {type: String, required: true},
    quantity: {type: Number, required: true},
})

//REST API on ThreadsDB.products
const Product = mongoose.model("product", productSchema)

export default Product;