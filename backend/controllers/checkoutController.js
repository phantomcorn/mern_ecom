import asyncHandler from "express-async-handler"
import stripe from "../db/stripe.js";
import getNextOrderNumber from "../utils/orderNumber.js";
import Order from "../models/orderModel.js";
const YOUR_DOMAIN = process.env.VITE_APP_BASE_URL;

// @route POST /api/checkout/create-checkout-session
const createSession = asyncHandler(async (req,res) => {

    const cart = req.body
    const line_items = cart.map((product) => ({price : product.priceId, quantity: product.quantity}))
    const order_id = await getNextOrderNumber()

    const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: line_items,
        metadata: {
            order_id
        },
        shipping_address_collection: {
            allowed_countries: ["GB"]
        },
        shipping_options: [
            {shipping_rate: "shr_1RGWq3Q6v7HEvM5BIQ9afq8q"},
            {shipping_rate: "shr_1RGWhJQ6v7HEvM5B2o5KHr5S"},
            {shipping_rate: "shr_1RGWhlQ6v7HEvM5BEL0owx8M"}
        ],
        //[
            // {
            //     // Provide the exact Price ID (for example, price_1234) of the product you want to sell
            //     price: 'price_1RCzmqQ6v7HEvM5BOoTWQBYS',
            //     quantity: 1,
            // },
        // ],
        return_url: `${YOUR_DOMAIN}/return/{CHECKOUT_SESSION_ID}`,
        mode: 'payment',
    })

    if (!session) {
        return res.status(404).send({message: "Error creating new session"});
    }
    return res.status(200).json({clientSecret: session.client_secret});
})

// @route GET /api/checkout/:checkoutId
const getSession = asyncHandler(async (req,res) => {
    const {checkoutId} = req.params
    if (!checkoutId) return res.status(404).json({message: "No session provided"})
    const session = await stripe.checkout.sessions.retrieve(checkoutId)

    if (!session) return res.status(404).json({message: "No session found"})

    return res.status(200).json({...session})
})

//  @route POST /hooks triggered on event: checkout.session.completed
const fulfillCheckout = async (sessionId, customerDetails) => {

    console.log('Fulfilling Checkout Session ' + sessionId);

    // TODO: Make this function safe to run multiple times,
    // even concurrently, with the same session ID
    var order = await Order.findOne({session: sessionId})
    // TODO: Make sure fulfillment hasn't already been
    // performed for this Checkout Session
    if (order && order.fulfilled) {
        console.log("Order existed and fulfilled")
        return
    } 
    
    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    // Check the Checkout Session's payment_status property
    // to determine if fulfillment should be performed
    if (checkoutSession.payment_status !== 'unpaid') {
      // TODO: Perform fulfillment of the line items
        const email = customerDetails.email
        const order = checkoutSession.metadata.order_id
        const products = checkoutSession.line_items.data.map((item) => (
            {
                productId: item.id,
                description: item.description,
                priceId: item.price.id,
                unitPrice: item.price.unit_amount,
                quantity: item.quantity
            }
        ))
        const subTotal = checkoutSession.amount_subtotal
        const total = checkoutSession.amount_total
        const currency = checkoutSession.currency
        const shippingCost = checkoutSession.shipping_cost.amount_total
        const shippingAddress = customerDetails.address
        shippingAddress.name = customerDetails.name // add new field
        // TODO: Record/save fulfillment status for this
        // Checkout Session
        await Order.findOneAndUpdate(
            {session: sessionId}, 
            {
                email, 
                order, 
                products,
                subTotal,
                total,
                currency,
                shippingCost,
                shippingAddress,
                billingAddress: shippingAddress,
                fulfilled: true,
                fulfilledAt: Date.now(),
                status: "To ship",
                tracking: null
            },
            {upsert: true}
        )
    }
    console.log("Order fulfilled!")
    // TODO: Register endpoint for stripe to deliver events to 
}

export {createSession, getSession, fulfillCheckout}