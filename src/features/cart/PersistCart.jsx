import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRestoreQuery } from "./cartApiSlice";
/*
    Wrapper component for every pages we want to persis our login for
    Redux does not hold our state on refresh 
    Instead, we use the jwt cookie stored in our browser to regenerate our access token which can be used to authorize our login
*/
const PersistCart = () => {

    // const token = useSelector(selectCurrToken) //get current access token from our state
    const effectRan = useRef(false)
    const [trueSuccess, setTrueSuccess] = useState(false)

    const {
        data,
        isLoading,
        isSuccess, //bug: isSuccess can be true before setCredentials is set => add trueSuccess flag
        isError,
        error         
    } = useRestoreQuery()

    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== "development") { //React 18 strict mode

            if (isSuccess) {
                setTrueSuccess(true)
            }
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
        console.log("Error")
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

export default PersistCart