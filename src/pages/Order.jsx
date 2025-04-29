import React from "react"
export default function Order({order}) {

    // const {data, isLoading, isError} = useGetOrderQuery({id: order?.id}, {skip: !order})

    if (!order) return <div> No order found </div>
    // if (isLoading) return <div> Loading... </div>
    // if (isError) return <div> Error retrieving order </div>
    const products = order.products
    return (
        <div>
            {order.order}

            <div>Items</div>
            {products.map((product) => (
                <React.Fragment key={product.productId}>
                    <div> {product.description} </div>
                    <div> {product.priceCopy}x{product.quantity} </div>
                    <div> {product.totalPriceCopy}</div>
                </React.Fragment>
            ))}
            <div>Subtotal: {order.subtotal_copy}</div>
            <div>Shipping: {order.shipping_copy}</div>
            <div>Total: {order.total_copy}</div>

            <div>Shipment to:</div>
            <div> {order.shippingAddress.name}</div>
            <div> {order.shippingAddress.line1}</div>
            <div> {order.shippingAddress.line2}</div>
            <div> {order.shippingAddress.city}</div>
            <div> {order.shippingAddress.country}</div>
            <div> {order.shippingAddress.postal_code}</div>
            
            <div> Billing address:</div>
            <div> 
                {!order.billing ? 
                    <div>Same as shipping address</div> :
                    <>
                        <div> {order.billingAddress.name}</div>
                        <div> {order.billingAddress.line1}</div>
                        <div> {order.billingAddress.line2}</div>
                        <div> {order.billingAddress.city}</div>
                        <div> {order.billingAddress.country}</div>
                        <div> {order.billingAddress.postal_code}</div>
                    </>
                }
            </div>

            <div> STATUS: {order.status} </div>
            <div> Tracking: {order.tracking? order.tracking : "Check back later"}</div>
        </div>
    )
}