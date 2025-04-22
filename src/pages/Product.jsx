import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useAddToCartMutation } from "../features/cart/cartApiSlice";
import { useGetProductQuery } from "../features/product/productApiSlice";
import { setCart } from "../features/cart/cartSlice";
import getPrice from "../features/product/priceConversion";

export default function Product() {

  const dispatch = useDispatch()
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
  const priceId = priceObj.id
  const price = getPrice(priceObj.currency,priceObj.unit_amount)

  const handleClick = (e) => {
    e.preventDefault()
    try {
      const resp = addToCart({id, priceId, quantity}).unwrap()
      const products = resp.products
      dispatch(setCart({products}))
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