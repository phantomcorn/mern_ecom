import { useState } from "react"
import { useAdminDeleteProductMutation } from "../../../features/admin/product/productApiSlice"

export default function DeleteVerifyForm({id, closePopup}) {

    const [deleteProduct, deleteProductProps] = useAdminDeleteProductMutation()
    const [err, setErr] = useState(null)

    async function handleOnClick(e, yes) {
        e.preventDefault()
        if (yes){
            try {
                await deleteProduct({id}).unwrap()
            } catch (err) {
                setErr(err.data.message)
                console.log(err)
            }
        }
        closePopup()
    }

    return(
        <div>
            Are you sure you would like to remove this product?
            <button onClick={(e) => handleOnClick(e, true)}> Yes </button>
            <button onClick={(e) => handleOnClick(e, false)}> No </button>
            <div> {err} </div>
        </div>
    )
}