import asyncHandler from "express-async-handler"
import Order from "../models/orderModel.js"


// @route GET /api/user/order/:sessionId
// const getOrder = asyncHandler(async (req,res) => {
    
//     const {sessionId} = req.params
//     const items = await stripe.checkout.sessions.listLineItems(sessionId)

//     if (!items) return res.status(404).json({message: "No order found", orders: []})
//     return res.status(200).json({order: items})
// })

// @route GET /api/user/order
const getOrders = asyncHandler(async (req,res) => {
    /* An order is a checkout session that has been fullfilled */
    const {email} = req.body
    const orders = await Order.find({email})
    if (!orders) return res.status(200).json({message: "No orders found", orders: []})
    return res.status(200).json({orders})
})


export { getOrders}