
import { useEffect, useRef, useState } from "react"
import { useAdminUpdateQuantityMutation } from "../../../features/admin/product/productApiSlice"

export default function UpdateQuantityForm({id, quantity, closePopup}) {

    const [updateQuantity, {isSuccess, isLoading, isError, isUninitialized}] = useAdminUpdateQuantityMutation()
    const newQuantityRef= useRef()
    const handleOnChange = (e) => newQuantityRef.current = e.target.value
    const [err, setErr] = useState(null)

    async function handleOnClick(e) {
        e.preventDefault()
        try {
            const newQuantity = parseInt(newQuantityRef.current)
            if (!newQuantity) {
                setErr("Not a number")
                return
            }
            
            await updateQuantity({id, quantity: newQuantity })
        } catch (err) {
            console.log(err)
            setErr(err.data.message)
        }
    }

    useEffect(() => {
        if (isSuccess) closePopup()
    }, [isSuccess])

    return (
        <div> 
            Quantity:
            <input onChange={handleOnChange} placeholder={quantity} type="number"/>

            <button onClick={handleOnClick}>
                {isUninitialized && "Update"} 
                {isLoading && "Updating..."} 
            </button>
            <div> {err} </div>
        </div>
    )
}
