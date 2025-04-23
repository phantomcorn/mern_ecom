import getPrice from "../../features/product/priceConversion"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAdminSendLogoutMutation } from "../../features/admin/auth/authApiSlice"
export default function AdminDashboard() {

    const navigate = useNavigate()
    // if (isLoading) return <div> Loading... </div>
    // if (isError) {
    //     if (error.status === 403) {
    //         return <div> Your login session has expired. Please <Link to="/login">login</Link> again </div>
    //     } else {
    //         return <div> {error.message} </div>
    //     }
    // }
    const [sendLogout, sendLogoutProps] = useAdminSendLogoutMutation()

    async function handleSendLogout(e) {
        e.preventDefault()
        try {
            await sendLogout().unwrap()
            navigate("/admin/login")
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <h1> Welcome back, Admin </h1>
            <button onClick={handleSendLogout}> Logout </button>
        </div>
    )
}