import asyncHandler from "express-async-handler"
import stripe from "../db/stripe.js";
const YOUR_DOMAIN = process.env.VITE_APP_BASE_URL;

// @route POST /api/checkout/create-checkout-session
const createSession = asyncHandler(async (req,res) => {
    const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: [
            {
                // Provide the exact Price ID (for example, price_1234) of the product you want to sell
                price: 'price_1RCidQQ6v7HEvM5BflFeal3b',
                quantity: 1,
            },
        ],
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

export {createSession, getSession}