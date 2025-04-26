import getPrice from "../../features/product/priceConversion"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAdminSendLogoutMutation } from "../../features/admin/auth/authApiSlice"
import { useAdminGetProductsQuery} from "../../features/admin/product/productApiSlice"
import UpdateQuantityForm from "./productPopup/UpdateQuantityForm"
import NewProductForm from "./productPopup/NewProductForm"
import DeleteVerifyForm from "./productPopup/DeleteVerifyForm"

export default function AdminDashboard() {

    const navigate = useNavigate()
    const [sendLogout, sendLogoutProps] = useAdminSendLogoutMutation()
    
    const [deleteProps, setDeleteProps] = useState({})
    const [updateFormProps, setUpdateFormProps] = useState({})

    const [openUpdate, setOpenUpdate] = useState(false)
    const [openCreate, setOpenCreate] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const {data, error, isSuccess, isLoading, isError} = useAdminGetProductsQuery(undefined, {
        pollingInterval: 5 * 60 * 1000, //Retrieve information every 5 minutes
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    async function handleSendLogout(e) {
        e.preventDefault()
        try {
            await sendLogout().unwrap()
            navigate("/admin/login")
        } catch (err) {
            console.log(err)
        }
    }

    function handleSetQuantity(e, product) {
        setUpdateFormProps({
            id: product.productId,
            quantity: product.quantity
        })
        setOpenUpdate(true)
    }

    function handleRemove(e, product) {
        setDeleteProps({id: product.productId})
        setOpenDelete(true)
    }


    return (
        <div>
            <h1> Welcome back, Admin </h1>
            <div>
                {isLoading && <div> Fetching products... </div>}
                {isError && <div> Error fetching products </div>}
                {isSuccess && 
                    <div>
                        Products
                        {data.products.map((product) => (
                            <div key={product._id}>
                                <div> {product.name} </div>
                                <div> Quantity: {product.quantity} </div>
                                <div> {product.productId} </div>
                                <button onClick={(e) => handleSetQuantity(e, product)}> Update quantity</button>
                                <button onClick={(e) => handleRemove(e, product)}> Remove </button>
                            </div>
                        ))}
                        <button onClick={() => setOpenCreate(true)}> Add new product</button>
                    </div>
                }
            </div>  
            
            <button onClick={handleSendLogout}> Logout </button>

            {openUpdate && <UpdateQuantityForm {...updateFormProps} closePopup={() => setOpenUpdate(false)} />}
            {openCreate && <NewProductForm closePopup={() => setOpenCreate(false)}/>}
            {openDelete && <DeleteVerifyForm {...deleteProps} closePopup={() => setOpenDelete(false)}/>}
        </div>
    )
}