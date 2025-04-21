/*
    Mongoose allows you to model data in MongoDB as object to help with types
*/

import mongoose from "mongoose"

//model for database
const orderSchema = new mongoose.Schema({
    email: {type: String, required:true},
    order: {type: String, required: true, unique: true},
    session: {type: String, required: true, unique: true},
    products : [{
        productId: {type: String, required: true},
        description: {type:String, required: true},
        priceId: {type: String, required: true},
        unitPrice: {type: Number, required: true},
        currency: {type: String, required: true},
        quantity:  {type: Number, required: true},
    }],
    shippingAddress: {
        name: {type: String, required: true},
        line1: {type: String, required: true},
        line2: {type: String},
        city: {type: String, required: true},
        country: {type: String, required: true},
        postal_code: {type: String, required: true},
        state: {type: String}
    },
    billing: {type: Boolean, default: false},
    billingAddress: {
        name: {type: String},
        line1: {type: String},
        line2: {type: String},
        city: {type: String},
        country: {type: String},
        postal_code: {type: String},
        state: {type: String}
    },
    fulfilled: {type: Boolean, required: true},
    fulfilledAt: {type: Date, required: true},
    status: {type: String, required: true},
    tracking: {type: String}
})

//REST API on ThreadsDB.orders
const Order = mongoose.model("order", orderSchema)

export default Order;