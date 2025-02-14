import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; //from "@reduxjs/toolkit/query/"" will not give you react hook for endpoints
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery(
  {
    baseUrl: import.meta.env.VITE_APP_BACKEND_URL,
    credentials: "include",
    prepareHeaders: ((headers, {getState}) => {
      const token = getState().auth.token // authSlice token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    })
  }
)

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // console.log(args) // request, url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) // custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) { //Invalid(Expired) access token
    const refreshResult = await baseQuery("/api/auth/refresh", api, extraOptions)
    if (refreshResult?.data) {

      // store new access token
      api.dispatch(setCredentials({...refreshResult.data}))

      // retry original query with new token
      result = await baseQueryWithReauth(args, api, extraOptions)

    } else {

      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login session has expired. Please login again"
      }
      return refreshResult

    }
  }
  return result
}

/* 
  Main apiSlice (Allow us to define our baseQuery once)
  We inject different endpoints from different files to this apiSlice 
*/
export const apiSlice = createApi(
  {
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User"],
    endpoints: builder => ({})
  }
)
