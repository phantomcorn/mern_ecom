import asyncHandler from "express-async-handler"
import Order from "../models/orderModel.js"
import getPrice from "../utils/priceConversion.js"


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

    const ordersResp = orders.map((order) => {

        const products = order.products.map((product) => (
            {
                productId: product.productId,
                description: product.description,
                priceId: product.priceId,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                priceCopy: getPrice(order.currency, product.unitPrice),
                totalPriceCopy: getPrice(order.currency, product.unitPrice * product.quantity)
            }
        ))


        return {
            order: order.order,
            session: order.session,
            billing: order.billing,
            billingAddress: order.billingAddress,
            currency: order.currency,
            email: order.email,
            fulfilled: order.fulfilled,
            fulfilledAt: order.fulfilledAt,
            shippingAddress: order.shippingAddress,
            shippingCost: order.shippingCost,
            status: order.status,
            tracking: order.tracking,
            products,
            subtotal_copy: getPrice(order.currency, order.subTotal),
            shipping_copy: getPrice(order.currency, order.shippingCost),
            total_copy: getPrice(order.currency, order.total)
        }
    })

    return res.status(200).json({orders: ordersResp})
})


export { getOrders}