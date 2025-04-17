import { apiSlice } from "../../app/api/apiSlice";

export const checkoutApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        startCheckout: builder.mutation({
            query: payload => ({
                url: "/api/checkout/create-checkout-session",
                method: 'POST',
                body: payload.cart
            }),
            invalidatesTags: ["Checkout"]
        }),
        getSession: builder.query({
            query: payload => `/api/checkout/${payload.id}`,
            providesTags: ["Checkout"]
        })
    })
})

export const {useStartCheckoutMutation, useGetSessionQuery} = checkoutApiSlice