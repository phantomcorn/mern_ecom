import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useStartCheckoutMutation } from '../features/checkout/checkoutApiSlice';
import { useCallback } from 'react';
import { useSelector } from "react-redux";
import { selectCurrCart } from "../features/cart/cartSlice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_FRONTEND_KEY)

export default function Checkout() {
    
    const cart = useSelector(selectCurrCart)
    const [startCheckout, {props}] = useStartCheckoutMutation()
    const fetchClientSecret = useCallback(() => {
        try {
            const resp = startCheckout({cart}).unwrap().then((data) => data.clientSecret)
            return resp
        } catch (err) {
            console.log(err)
        }
    })
    
    const options = {fetchClientSecret}

    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}>
                <EmbeddedCheckout/>
            </EmbeddedCheckoutProvider>
        </div>
    )


}