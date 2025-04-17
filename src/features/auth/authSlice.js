import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null
    },
    reducers: {
        setCredentials: (state,action) => {
            const token = action.payload.token //access token
            state.token = token
        }
    }
})

export const { setCredentials } = authSlice.actions

export default authSlice.reducer //add to store