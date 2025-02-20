import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        products: [] //access token
    },
    reducers: {
        setCart: (state, action) => {
            const products = action.payload.products
            state.products = products
            // console.log("cart updated!")
        },
    }

})


export const { setCart } = cartSlice.actions

export default cartSlice.reducer //add to store

export const selectCurrCart = (state) => state.cart.products //use to get current access token
