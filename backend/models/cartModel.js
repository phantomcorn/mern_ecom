/*
    Mongoose allows you to model data in MongoDB as object to help with types
*/

import mongoose from "mongoose"

//model for database
const cartSchema = new mongoose.Schema({
    session: {type: String, required: true, unique: true},
    products : [{
        productId: {type: String, required: true},
        priceId: {type: String, required: true},
        quantity:  {type: Number, required: true},
    }],
    createdAt: {type: Date, expires: 3 * 24 * 60 * 60 * 1000, default: Date.now}
})

//REST API on ThreadsDB.carts
const Cart = mongoose.model("cart", cartSchema)

export default Cart;