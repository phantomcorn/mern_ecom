import { Link } from 'react-router-dom';
import { useGetAllProductQuery } from '../features/product/productApiSlice';
import Cart from './Cart';
import ProductQuickAdd from './ProductQuickAdd';


export default function Main() {

   
    const { data, isLoading, isError, isSuccess } = useGetAllProductQuery(undefined, {
        pollingInterval: 5 * 60 * 1000, //Retrieve information every 5 minutes
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    return (
        <div className="grid grid-cols-[1fr_1fr_1fr_2fr] grid-rows-[1fr_2fr_3fr_2fr_1fr]">
            <div className='navbar flex justify-evenly border-b-3 border-dashed border-black p-[50px_0_50px_0] row-start-1 col-span-full'>
                <Link to="product" clas>All Products</Link>
                <Link to="login">Manage my order</Link> 
            </div>
            {isSuccess && data.products.map((product, i) => (
                <ProductQuickAdd product={product} i={i} />
            ))}
            <Cart/>
           
        </div>
    )
}