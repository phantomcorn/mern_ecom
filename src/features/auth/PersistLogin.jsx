import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrToken } from "./authSlice";

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
        isUninitialized,
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
            When you refresh the page, token is thrown away
            We want to also check whether we wanted to persist our login
            If so, we verify our refresh token
        */
        return () => effectRan.current = true
        
        //To disable warnings
        //eslint-disalble-next-line
    }, [])

    let content
    if (!persist) { 
        console.log("Not persist")
        /*
            persist: no
        */
        content = <Outlet/>
    } else if (isLoading) { 
        console.log("Loading")
        /*
            persist: yes token: no 
        */
        content = <div> Loading... </div>
    } else if (isError) { 
        console.log("Error")
        /*
            persist: yes token: no 
            when our refresh token expires
        */
        content = (
            <div> 
                {error.data?.message} 
                <Link to="/">Please login again.</Link>
            </div>
        )
    } else if (isSuccess && trueSuccess) { 
        console.log("Persist success")
        /*
            persist: yes token: yes
            calling refresh is successful and we have given it enough time for token to be set
        */
        content = <Outlet/>
    } else if (token && isUninitialized) { 
        console.log("Token but not mutated (success)")
        /* 
            persist: yes token: yes 
            there is token but we haven't triggered the mutation i.e we haven't called refresh()
        */
        content = <Outlet/>
    }
    
    return content
}

export default PersistLogin