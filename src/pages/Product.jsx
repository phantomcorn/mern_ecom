import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAddToCartMutation } from "../features/cart/cartApiSlice";
import { useGetProductQuery } from "../features/product/productApiSlice";

export default function Product() {
  const {id} = useParams(); // Extracts "67af5949ffde5f37c751f47d"
  const [quantity, setQuantity] = useState(1)
  const [addToCart, cartMutation] = useAddToCartMutation()
  const {data, isLoading, isError, isSuccess} = useGetProductQuery({id}) /* Retrieves product information by Id*/

  if (isLoading) {
    return (<div> Loading...</div>)
  }

  if (isError) {
    return (<div> Product not found </div>)
  }

  const product = data
  const priceObj = product.prices[0]
  const price = priceObj.copy

  async function handleClick(e) {
    e.preventDefault()

    const data = {
      name: product.name,
      id: product.id,
      priceId: product.prices[0].id,
      quantity,
      unitAmt: product.prices[0].unit_amount,
      currency: product.prices[0].currency
    }
    
    try {
      await addToCart(data).unwrap()
    } catch (err) {
      console.log(err)
    } 
  }

  return (
    <div>
      <h1>Product Page</h1>
      <p>Product ID:{product.id} </p>
      <p>Price: {price}</p>
      <button onClick={handleClick}>
        {cartMutation.isUninitialized && "Add to cart"}
        {cartMutation.isLoading && "Adding..."}
        {cartMutation.isSuccess && "Added! Add more?"}
      </button>
      <div>
        <button onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}>-</button>
        {quantity}
        <button onClick={() => setQuantity((prev) => Math.min(prev + 1, 10))}>+</button>
      </div>
    </div>
  );

};