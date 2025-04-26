import getPrice from "../../features/product/priceConversion"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAdminSendLogoutMutation } from "../../features/admin/auth/authApiSlice"
import { useAdminGetProductsQuery } from "../../features/admin/product/productApiSlice"
export default function AdminDashboard() {

    const navigate = useNavigate()
    const [sendLogout, sendLogoutProps] = useAdminSendLogoutMutation()
    const {data, error, isSuccess, isLoading, isError} = useAdminGetProductsQuery(undefined, {
        pollingInterval: 5 * 60 * 1000, //Retrieve information every 5 minutes
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

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
            <div>
                {isLoading && <div> Fetching products... </div>}
                {isError && <div> Error fetching products </div>}
                {isSuccess && 
                    <div>
                        Products
                        {data.products.map((product) => (
                            <div key={product._id}>
                                <div> {product.name} </div>
                                <div> {product.quantity} </div>
                                <div> {product.productId} </div>
                            </div>
                        ))}
                    </div>
                }
            </div>  
            
            <button onClick={handleSendLogout}> Logout </button>
        </div>
    )
}