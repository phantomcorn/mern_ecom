import { useEffect, useRef, useState } from "react";
import { useAdminAddProductMutation } from "../../../features/admin/product/productApiSlice";
export default function NewProductForm({closePopup}) {

    const [addProduct, {isSuccess, isLoading, isError, isUninitialized}] = useAdminAddProductMutation()
    const [err, setErr] = useState(null)
    const props = {
        name: useRef(),
        quantity: useRef(),
        price: useRef(),
        description: useRef()
    }

    const handleOnChange = (e) => props[e.target.name].current = e.target.value

    async function handleOnClick(e) {
        e.preventDefault()
        try {
            await addProduct({
                name: props.name.current,
                quantity: props.quantity.current,
                price: props.price.current,
                description: props.description.current
            }).unwrap()
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
            <div>
                <div>Product name: <input name="name" onChange={handleOnChange}/></div>
                <div>Price: <input name="price" onChange={handleOnChange}/></div>
                <div>Quantity: <input name="quantity" onChange={handleOnChange}/></div>
                <div>Description <input name="description" onChange={handleOnChange}/></div>
            </div>

            <button onClick={handleOnClick}> 
                {isUninitialized && "Create product"} 
                {isLoading && "Creating..."}
            </button>
            <div> {err} </div>
        </div>
    )
}