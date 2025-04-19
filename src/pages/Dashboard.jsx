import { useGetOrdersQuery } from "../features/user/userApiSlice"

export default function Dashboard() {

    const {resp, isSuccess} = useGetOrdersQuery()

    const email = resp.data.email
    const orders = resp.data.orders
    return (
        <div>
            <h2>{email}</h2>
            <div> Your orders </div>
            <div> {orders}</div>

        </div>
    )
}