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
  const [addToCart, {isUninitialized, isLoading, isError, isSuccess}] = useAddToCartMutation()
  const productResp = useGetProductQuery({id}) /* Retrieves product information by Id*/

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

  if (productResp.isSuccess) {

    const product = productResp.data
    const priceObj = product.prices[0]
    const price = getPrice(priceObj.currency,priceObj.unit_amount)

    return (
      <div>
        <h1>Product Page</h1>
        <p>Product ID:{product.id} </p>
        <p>Price: {price}</p>
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
  } else {
    return (
      <div> Product not found </div>
    )
  }
  
};