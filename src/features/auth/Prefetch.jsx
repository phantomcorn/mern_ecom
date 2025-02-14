import { store } from "../../app/store";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { userApiSlice } from "../user/userApiSlice";

/*
    Used as a parent for every authentication (login) link
    Prefetch any data so that they persists when we visit any authenticated children page
*/
const Prefetch = () => {

    useEffect(() => {
        console.log("subscribing...")
        const user = store.dispatch(userApiSlice.endpoints.getUserInfo.initiate())
        return () => {
            console.log("unsubscribing...")
            user.unsubscribe()
        }
    }, [])


    return <Outlet/>
}

export default Prefetch