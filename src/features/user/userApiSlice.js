import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUserInfo: builder.query({
            query: () => "/api/user"
        }),
        provideTags: ["User"] // Result cached with the label User (Is retrieved again in cache only if subscribed)
        /*
            If a mutation endpoint is called and provides an `invalidateTags: ["User"]`,
            Any cached query providing tag of "User" will be invalidated and 
            the next call to it will be refetched from server instead
        */
    })
})

export const {
    useGetUserInfoQuery
} = userApiSlice