import { useParams } from "react-router-dom"
import { useGetSessionQuery } from "../features/checkout/checkoutApiSlice"
import { useSendClearCartMutation } from "../features/cart/cartApiSlice"
import { Link } from "react-router-dom"
import { useEffect } from "react"

export default function Return() {

    const {sessionId} = useParams()
    const sessionResp = useGetSessionQuery({id : sessionId})
    const [sendClearCart, clearCartState] = useSendClearCartMutation()



    useEffect(() => {

        async function clearCart() {
            if (sessionResp.isSuccess) {
                try {
                    await sendClearCart().unwrap()
                    console.log("cart cleared")
                } catch (err) {
                    console.log(err)
                }
            }
        }
        
        if (sessionResp.isSuccess) clearCart()

    }, [sessionResp.isSuccess])  

    if (!sessionId) {
        /* No session found*/
    }
    
    if (sessionResp.isSuccess) {

        const session = sessionResp.data

        if (session.status === "complete") {
            return (
                <div>
                    Thank you! <Link to="/"> Back to Home </Link>
                </div>
            )
        } else if (session.status === "open") {
            /* Should navigate back to checkout page */
        } else if (session.status === "expired") {
            return (
                <div>
                    Session has expired. <Link to="/"> Back to Home </Link>
                </div>
            )
        }
    }
}