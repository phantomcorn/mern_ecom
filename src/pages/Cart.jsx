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
        <div className="relative border-l-3 border-dashed border-black col-start-4 row-start-2 row-span-full"> 
            <div className="text-center text-3xl border-dashed border-black border-b-3">Cart:</div>
            {cart && 
                cart.map((item, idx) => 
                    <div key={item.productId} class="text-2xl border-dashed border-black border-b-3">
                        <div className="flex flex-row justify-between">
                            <div > {item.name} </div>
                            <div>{item.priceCopy}</div>
                        </div>
                        <div className="flex justify-end">
                            <button className="cursor-pointer" onClick={(e) => modifyCart(e, decrFromCart, item.productId)}>-</button>
                            {item.quantity}
                            <button className="cursor-pointer" onClick={(e) => modifyCart(e, incrFromCart, item.productId)}>+</button>
                        </div>
                        <div className="text-right">{item.totalCopy} </div>
                    </div>
                )
            } 

            {cart && cart.length > 0 && <Link to="/checkout" className="absolute bottom-10 right-0 block w-50 bg-black text-white">Checkout</Link>}
        </div> 
    )
}