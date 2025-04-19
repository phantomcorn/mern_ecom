import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrders: builder.query({
            query: payload => ({
                url: "/api/user/order",
                body: payload
            }),
            providesTags: ["Order"]
        }),
        getOrder: builder.query({
            query: payload => `/api/user/order/${payload.id}`,
            providesTags: ["Order"]
        }),

    })
})

export const {
    useGetOrdersQuery,
    useGetOrderQuery
} = userApiSlice