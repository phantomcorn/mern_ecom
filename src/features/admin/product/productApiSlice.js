import { apiSlice } from "../../../app/api/apiSlice";

const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        adminGetProducts : builder.query({
            query: () => "/api/admin/product"
        }),
        adminAddProduct : builder.mutation({
            query: payload => ({
                url: "/api/admin/product/add",
                method: "POST",
                body: payload
            })
        }),
        adminDeleteProduct : builder.mutation({
            query: payload => ({
                url: "/api/admin/product/delete",
                method: "POST",
                body: {id : payload.id}
            })
        }),
        adminUpdateQuantity : builder.mutation({
            query: payload => ({
                url: "/api/admin/product/update",
                method: "POST",
                body: {id : payload.id, quantity : payload.quantity}
            })
        }),
    })
})

export const {
    useAdminGetProductsQuery,
    useAdminDeleteProductMutation, 
    useAdminAddProductMutation, 
    useAdminUpdateQuantityMutation} = productApiSlice