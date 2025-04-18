import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import { selectCurrToken } from "./authSlice";
import usePersist from "../../hooks/usePersist"
import { useSelector } from "react-redux";
/*
    Wrapper component for every pages we want to persis our login for
    Redux does not hold our state on refresh 
    Instead, we use the jwt cookie stored in our browser to regenerate our access token which can be used to authorize our login
*/
const PersistLogin = () => {

    const [persist] = usePersist()
    const token = useSelector(selectCurrToken) //get current access token from our state
    const effectRan = useRef(false)
    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isLoading,
        isSuccess, //bug: isSuccess can be true before setCredentials is set => add trueSuccess flag
        isError,
        error         
    }] = useRefreshMutation()

    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== "development") { //React 18 strict mode

            const verifyRefreshToken = async () => {
                console.log("Verifying refresh token")
                try {
                    // const response = 
                    await refresh() //call refresh authApiSlice

                    // { token } = response.data

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
        console.log("Error persisting login")
        /*
            data: no 
        */
        content = (
            <div> {error.data?.message} </div>
        )
    } else if (isSuccess && trueSuccess) { 
        console.log("Persist success")
        /*
            cart : yes
            calling restore is successful and we given enough time for setCart
        */
        content = <Outlet/>
    } 
    return content
}

export default PersistLogin