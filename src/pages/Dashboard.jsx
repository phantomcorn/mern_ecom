import { useGetOrdersQuery } from "../features/user/userApiSlice"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Order from "./Order"
export default function Dashboard() {

    const {data, error, isSuccess, isError, isLoading} = useGetOrdersQuery(undefined, {
        pollingInterval: 5 * 60 * 1000, //Retrieve information every 5 minutes
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
        }
    )
    
    const [index, setIndex] = useState(-1)
    const [currOrder, setCurrOrder] = useState(null)

    useEffect(() => {
        // console.log(index)
        if (index !== -1) setCurrOrder(orders[index])
    },[index])

    

    if (isLoading) return <div> Loading... </div>
    if (isError) {
        if (error.status === 403) {
            return <div> Your login session has expired. Please <Link to="/login">login</Link> again </div>
        } else {
            return <div> {error.message} </div>
        }
    }
    
    const email = data.orders[0].email
    const orders = data.orders

    return (
        <div>
            <h1> Welcome back, {email} </h1>

            {index === -1 && 
                <div>
                    <h3>Your orders</h3>
                    {orders.map((order, i) => (
                            <div key={order.order} onClick={() => setIndex(i)}>
                                <div> {order.order}</div>
                                <div>{order.total_copy} </div>
                                <div> STATUS: {order.status} </div>
                            </div>
                        )
                    )}
                </div>
            }

            {index !== -1 &&
                <>
                    <button onClick={() => setIndex(-1)}> Back to orders </button>
                    <Order order={currOrder}/>
                </>
            }
        </div>
    )
}