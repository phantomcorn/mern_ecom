import { apiSlice } from "../../app/api/apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrders: builder.query({
            query: payload => ({
                url: "/api/order",
                body: payload
            })
        }),
        getOrder: builder.query({
            query: payload => ({
                url: `/api/order/${payload.checkoutId}`,
            })
        }),

    })
})

export const {
    useGetOrdersQuery,
    useGetOrderQuery
} = orderApiSlice