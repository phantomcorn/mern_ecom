import { apiSlice } from "../../app/api/apiSlice";

export const checkoutApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        startCheckout: builder.mutation({
            query: (cart) => ({
                url: "/api/checkout/create-checkout-session",
                method: 'POST',
                body: {...cart}
            }),
            invalidatesTags: ["Checkout"]
        })
    })
})

export const {useStartCheckoutMutation} = checkoutApiSlice