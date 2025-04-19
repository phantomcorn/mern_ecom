import { useGetOrdersQuery } from "../features/user/userApiSlice"
import getPrice from "../features/product/priceConversion"
import { useState, useEffect } from "react"
import Order from "./Order"
export default function Dashboard() {

    const {data, isSuccess, isError, isLoading} = useGetOrdersQuery()
    const [index, setIndex] = useState(-1)
    const [currOrder, setCurrOrder] = useState(null)

    useEffect(() => {
        // console.log(index)
        if (index !== -1) setCurrOrder(orders[index])
    },[index])

    

    if (isLoading) return <div> Loading... </div>
    if (isError) return <div> Error </div>

    const {email, orders: {data: orders}} = data

    return (
        <div>
            <h1> Welcome back, {email} </h1>

            {index === -1 && 
                <div>
                    <h3>Your orders</h3>
                    {orders.map((order, i) => {
                        if (order.metadata?.order_id) {
                            
                            return(
                                <div key={order.metadata.order_id} onClick={() => setIndex(i)}>
                                    <div> {order.metadata.order_id}</div>
                                    <div>{getPrice(order.currency,order["amount_total"])} </div>
                                </div>
                            )
                        }
                    })}
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