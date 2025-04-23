import { apiSlice } from "../../../app/api/apiSlice";

const adminAuthApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({ //Define endpoints that will be used by frontend
        adminLogin: builder.mutation({
            query: credentials => ({ //credentials (i.e email)
                url: '/api/admin/auth/login',
                method: 'POST',
                body: credentials
            }),
            invalidatesTags: ["AdminAuth"]
        }),
        adminVerify: builder.mutation({
            query: credentials => ({
                url: "api/admin/auth/verify",
                method: "POST",
                body: credentials
            }),
            invalidatesTags: ["AdminAuth"]
        }),
        adminRefresh: builder.mutation({
            query: () => "api/admin/auth/refresh",
            async onQueryStarted(arg, {dispatch, queryFulfilled}) { //if query succesful, we automatically set our new state
                try {
                    const {data} = await queryFulfilled
                    dispatch(setCredentials({token: data.token}))
                } catch (err) {
                    console.log(err)
                }
            },
            providesTags: ["AdminAuth"],
            invalidatesTags: ["Auth", "Product", "Order"],
        })

    })
})

export const {
    useAdminLoginMutation,
    useAdminVerifyMutation,
    useAdminRefreshMutation
} = adminAuthApiSlice
