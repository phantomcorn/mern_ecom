import useStripe from "stripe"
const stripe = useStripe(process.env.STRIPE_BACKEND_KEY)

export default stripe