import { useGetAllProductQuery } from "../features/product/productApiSlice.js"
import { useNavigate, Link } from "react-router-dom"

export default function Dashboard() {


    const { data, isLoading, isError } = useGetAllProductQuery(undefined, {
        pollingInterval: 5 * 60 * 1000, //Retrieve information every 5 minutes
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    
    if (isLoading) return <div> Loading... </div>
    if (isError) return <div> Error </div>

    return (
        <div className="products">
            <div> All Products</div>
            {data && data.products &&
                data.products.map((product) => (

                    <Link key={product.id} to={`/product/${product.id}`}>
                        <div>{product.name}</div>
                        <div>{product.prices[0].copy}</div>
                    </Link>
                ))            
            }
        </div>
        
    )
}