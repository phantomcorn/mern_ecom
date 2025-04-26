import { apiSlice } from "../../../app/api/apiSlice";

const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        adminGetProducts : builder.query({
            query: () => "/api/admin/product"
        }),
    })
})

export const {
    useAdminGetProductsQuery
} = productApiSlice