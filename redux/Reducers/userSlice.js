import { createSlice } from "@reduxjs/toolkit";


const userSlice=createSlice({
    name:"user",
    initialState:{
        user:{
            name:"",
            email:"",
            cart:[],
            isAdmin:false,
            address:[],
            wishlist:[],
        }
    },
    reducers:{

    }
})


export default userSlice.reducer;