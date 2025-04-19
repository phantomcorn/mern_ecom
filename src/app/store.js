import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import cartReducer from "../features/cart/cartSlice"
import authReducer from "../features/auth/authSlice"

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer,
        [apiSlice.reducerPath] : apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

//Enable polling and refetching on apiSlice endpoints
setupListeners(store.dispatch)