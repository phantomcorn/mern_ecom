import { useSelector } from "react-redux";
import { selectCurrCart } from "../features/cart/cartSlice";
import { useIncrFromCartMutation, useDecrFromCartMutation } from "../features/cart/cartApiSlice";
import { Link } from "react-router-dom";

export default function Cart() {
    const cart = useSelector(selectCurrCart)
    const [incrFromCart, {incrIsLoading}] = useIncrFromCartMutation()
    const [decrFromCart, {decrIsLoading}] = useDecrFromCartMutation()

    const modifyCart = (e, func, id) => {
        e.preventDefault()
        try {
            func({ id }).unwrap()
        } catch (err) {
            if (!err.status) {
                console.log("No response from server")
            } else if (err.status === 404) {
                console.log("Fail to modify cart. Please refresh this page")
            }
        }
    }

    return (
        <div className="border-l-3 border-dashed border-black col-start-4 row-start-2 row-span-full"> 
            <div>Cart:</div>
            {cart && 
                cart.map((item, idx) => 
                    <div  key={item._id}>
                        <div> Item {idx + 1} </div>
                        <div>{item.productId}</div>
                        <div>
                            <button onClick={(e) => modifyCart(e, decrFromCart, item.productId)}>-</button>
                            {item.quantity}
                            <button onClick={(e) => modifyCart(e, incrFromCart, item.productId)}>+</button>
                        </div>
                    </div>
                )
            } 

            {cart.length > 0 && <Link to="/checkout">Checkout</Link>}
        </div> 
    )
}