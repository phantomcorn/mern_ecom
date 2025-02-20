import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useAddToCartMutation } from "../features/cart/cartApiSlice";
import { setCart } from "../features/cart/cartSlice";

export default function Product() {

  const dispatch = useDispatch()
  const {id} = useParams(); // Extracts "67af5949ffde5f37c751f47d"
  const [quantity, setQuantity] = useState(1)
  const [addToCart, {isUninitialized, isLoading, isError, isSuccess}] = useAddToCartMutation()

  const handleClick = (e) => {
    e.preventDefault()
    try {
      const resp = addToCart({id, quantity}).unwrap()
      const products = resp.products
      dispatch(setCart({products}))
    } catch (err) {
      console.log(err)
    } 
  }

  return (
    <div>
      <h1>Product Page</h1>
      <p>Product ID:{id} </p>
      <button onClick={handleClick}>
        {isUninitialized && "Add to cart"}
        {isLoading && "Adding..."}
        {isSuccess && "Added! Add more?"}
      </button>
      <div>
        <button onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}>-</button>
        {quantity}
        <button onClick={() => setQuantity((prev) => Math.min(prev + 1, 10))}>+</button>
      </div>
    </div>
  );
};