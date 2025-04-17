import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; //from "@reduxjs/toolkit/query/" will not give you react hook for endpoints

const baseQuery = fetchBaseQuery(
  {
    baseUrl: import.meta.env.VITE_APP_BACKEND_URL,
    credentials: "include",
    prepareHeaders: ((headers, {getState}) => {
      const token = getState().cart.token // cartSlice token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    })
  }
)

/* 
  Main apiSlice (Allow us to define our baseQuery once)
  We inject different endpoints from different files to this apiSlice 
*/
export const apiSlice = createApi(
  {
    baseQuery: baseQuery,
    tagTypes: ["Product", "Cart", "Checkout"],
    endpoints: builder => ({})
  }
)
