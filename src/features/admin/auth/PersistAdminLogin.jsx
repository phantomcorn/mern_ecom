import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAdminRefreshMutation } from "./authApiSlice";
import { selectCurrToken } from "../../auth/authSlice";
import usePersist from "../../../hooks/usePersist";
import { useSelector } from "react-redux";
/*
    Wrapper component for every pages we want to persis our login for
    Redux does not hold our state on refresh 
    Instead, we use the jwt cookie stored in our browser to regenerate our access token which can be used to authorize our login
*/
/* 
    We hit this component first everytime we refresh our web browser.
    P.S. We may arrive at an error here first.
*/
const PersistAdminLogin = () => {

    const [persist] = usePersist()
    const token = useSelector(selectCurrToken) //get current access token from our state
    const effectRan = useRef(false)
    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isLoading,
        isSuccess, //bug: isSuccess can be true before setCredentials is set => add trueSuccess flag
        isError,
        error         
    }] = useAdminRefreshMutation()

    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== "development") { //React 18 strict mode

            const verifyRefreshToken = async () => {
                console.log("Verifying refresh token")
                try {
                    // const response = 
                    await refresh().unwrap() //call refresh authApiSlice

                    // { token } = response.data
                    console.log("Access token granted")
                    setTrueSuccess(true)
                } catch (err) {
                    console.log(err)

                }
            }

            if (!token && persist) verifyRefreshToken()
        }

        /*
            When you refresh the page, cart is thrown away
            We restore our cart by session
        */
        return () => effectRan.current = true
        
        //To disable warnings
        //eslint-disalble-next-line
    }, [])

    let content = <Outlet/>
    if (isLoading) { 
        console.log("Loading")
        /*
            data: no 
        */
        content = <div> Loading... </div>
    } else if (isError) { 
        console.log("Error persisting admin login")
        /*
            data: no 
        */
        content = (
            <div> {error.data?.message} Please <Link to="/admin/login"> login </Link> again (PersistAdminLogin)</div>  
        )
    } else if (isSuccess && trueSuccess) { 
        console.log("Persist admin success")
        /*
            cart : yes
            calling restore is successful and we given enough time for setCredentials
        */
        content = <Outlet/>
    } 

    return content
}

export default PersistAdminLogin