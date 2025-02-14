import { useEffect, useRef } from "react"
import { useVerifyEmailMutation } from "../features/auth/authApiSlice"
import { Link } from "react-router-dom"

export default function VerifyEmail() {
 
    const [verifyEmail, {isLoading, isError, isSuccess}] = useVerifyEmailMutation()
    const effectRan = useRef(false)
    
    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== "development") { //React 18 strict mode
            const queryString = window.location.search
            const params = new URLSearchParams(queryString);
            const id = params.get("id")
            const verifyToken = params.get("verifyToken")

            const checkVerifyEmail = async () => {
                try {
                    await verifyEmail({ id, verifyToken }).unwrap()
                } catch (err) {
                    console.log(err)
                }
            }

            checkVerifyEmail()
        }

        return () => effectRan.current = true
    }, [])

    return (
        <div>
            {isSuccess && 
                <div> 
                    Email verified sucessfully. You may now <Link to="/">Login</Link> 
                </div>
            }
            {isLoading && <div> Verifying.... </div>}
            {isError && <div> Oops an error has occured </div>}
        </div>
    )
}