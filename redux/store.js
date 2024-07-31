import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Reducers/userSlice";
import productSlice from "./Reducers/productSlice";


const store=configureStore({
    reducer:{
        user:userSlice,
        product:productSlice
    }
})

export default store;