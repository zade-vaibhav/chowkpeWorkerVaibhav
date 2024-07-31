import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const products = createAsyncThunk("home/product", async () => {

    try {
        const responce = await fetch("https://fakestoreapi.com/products",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        const res = await responce.json();
        return res;

    } catch (err) {
        throw new Error({ message: "server error" })
    }
})

const productSlice = createSlice({
    name: "product",
    initialState: {
        product: [],
        state: "ideal"
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(products.pending, (state, action) => {
            state.state = "pending"
        }),
        builder.addCase(products.fulfilled, (state, action) => {
                state.product =action.payload
                state.state = "ideal"
        }),
        builder.addCase(products.rejected, (state, action) => {
                state.state = "error"
         })
    }
})


export default productSlice.reducer;
