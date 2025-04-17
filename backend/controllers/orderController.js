import asyncHandler from "express-async-handler"
import stripe from '../db/stripe.js'


// @route GET /api/order/:checkoutId
const getOrder = asyncHandler(async (req,res) => {
    
    const {checkoutId} = req.params
    const session = await stripe.checkout.sessions.listLineItems(checkoutId)

    if (!session) return res.status(404).json({message: "No order found", orders: []})
    return res.status(200).json({order: session})
})

// @route GET /api/order
const getOrders = asyncHandler(async (req,res) => {
    /* An order is a checkout session that has been fullfilled */
    const {email} = req.body
    const sessions = await stripe.checkout.sessions.list({
        customer_details: {email: email},
        status: "complete"
    })

    if (!sessions) return res.status(200).json({message: "No orders found", orders: []})
    return res.status(200).json({orders: sessions})
})


export {getOrder, getOrders}