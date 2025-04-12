import asyncHandler from "express-async-handler"
import useStripe from "stripe"

const stripe = useStripe(process.env.STRIPE_BACKEND_KEY)

const YOUR_DOMAIN = process.env.VITE_APP_BASE_URL;

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
        return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
        mode: 'payment',
    })

    if (!session) {
        res.status(404).send({message: "Error creating new session"});
    }
    res.status(200).json({clientSecret: session.client_secret});
})

export {createSession}