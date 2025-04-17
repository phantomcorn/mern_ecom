import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrders: builder.query({
            query: payload => ({
                url: "/api/user/order",
                body: payload
            })
        }),
        getOrder: builder.query({
            query: payload => ({
                url: `/api/user/order/${payload.checkoutId}`,
            })
        }),

    })
})

export const {
    useGetOrdersQuery,
    useGetOrderQuery
} = userApiSlice