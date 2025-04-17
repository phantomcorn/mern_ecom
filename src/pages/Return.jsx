import { useParams } from "react-router-dom"
import { useGetSessionQuery } from "../features/checkout/checkoutApiSlice"
export default function Return() {
    const {sessionId} = useParams()

    if (!sessionId) {
        /* No session found*/
    }
    const sessionResp = useGetSessionQuery({id : sessionId})
    if (sessionResp.isSuccess) {

        const session = sessionResp.data

        if (session.status === "complete") {
            return (
                <div>
                    Thank you!
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