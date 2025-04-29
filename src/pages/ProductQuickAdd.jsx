import {motion} from "framer-motion"
import { Link } from "react-router-dom"
import { useState } from "react"
const MotionLink = motion(Link)
import { useAddToCartMutation } from "../features/cart/cartApiSlice"
import { useDispatch } from "react-redux"
import { setCart } from "../features/cart/cartSlice"

export default function ProductQuickAdd({product,i}) {

    const [addToCart, cartMutation] = useAddToCartMutation()
    const dispatch = useDispatch()
    const [isHover, setIsHover] = useState(false)
    const [quantity, setQuantity] = useState(1)
    console.log(product)

    const handleOnClick = (e) => {
        e.preventDefault()
        // try {
        //     const resp = addToCart({product.id, product.priceId, quantity}).unwrap()
        //     const products = resp.products
        //     dispatch(setCart({products}))
        // } catch (err) {
        //     console.log(err)
        // } 
    }

    return (
        <motion.div className="relative cursor-pointer m-5 bg-black" key={`product${i}`} onHoverStart={() => setIsHover(true)} onHoverEnd={() => setIsHover(false)} >
                   
            <MotionLink className="absolute left-0 w-full h-full text-white no-underline text-center py-[100px]" to={`/product/${product.id}`} initial={{opacity: 1}} animate={{opacity: isHover ? 0 : 1}}>
                {product.name}
            </MotionLink>

            <motion.div className="flex flex-col absolute left-0 w-full h-full text-white no-underline text-center py-[50px]" initial={{opacity: 0}} animate={{opacity: isHover ? 1 : 0}} >
                <div> {product.description} </div>
                <div>{product.prices[0].copy} </div>
                <div className="flex justify-around">
                    <button className="cursor-pointer text-3xl" onClick={() => setQuantity((prev) => Math.max(1,prev - 1))}>-</button>
                    <div className="text-3xl">{quantity}</div>
                    <button className="cursor-pointer text-3xl" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                </div>
                <button className="border-3 border-white " onClick={handleOnClick}> 
                    {cartMutation.isUninitialized && "Quick add"}
                    {cartMutation.isLoading && "Adding..."}
                    {cartMutation.isSuccess && "Added! Add more?"} 
                </button>
            </motion.div>
                    
        </motion.div>
    )
}