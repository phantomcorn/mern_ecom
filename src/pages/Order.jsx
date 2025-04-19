import { useGetOrderQuery } from "../features/user/userApiSlice"

export default function Order({order}) {

    const {data, isLoading, isError} = useGetOrderQuery({id: order?.id}, {skip: !order})

    if (!order) return <div> No order found </div>
    if (isLoading) return <div> Loading... </div>
    if (isError) return <div> Error retrieving order </div>
    
    const products = data.order.data
    return (
        <div>
            {order.metadata.order_id}

            <div>Items</div>
            {products.map((product) => (
                <div key={product.id}>
                    <div> {product.description} </div>
                    <div> x{product.quantity} </div>
                </div>
            ))}
            
        </div>
    )
}