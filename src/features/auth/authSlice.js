import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null //access token
    },
    reducers: {
        setCredentials: (state, action) => {
            const token = action.payload.token //access token
            state.token = token
        },
        logout: (state, action) => {
            state.token = null
        }
    }

})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer //add to store

export const selectCurrToken = (state) => state.auth.token //use to get current access token