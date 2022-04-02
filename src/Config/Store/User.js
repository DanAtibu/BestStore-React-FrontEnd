import { createSlice } from "@reduxjs/toolkit";

const User = createSlice({
    name: "User",
    initialState: {
        // Store: "Total-Up",
        // Username: "Dan Atibu",
        // Id: Math.floor( Math.random() * 5 ),
        // Profile: ""
    },
    reducers: {
        login( state, action ) {
            // console.log( state, action.payload );
            // state = { ...action.payload }


            state.Store = action.payload.Store;
            state.Currency = action.payload.Currency;
            state.Username = action.payload.Username;
            state.Id = action.payload.Id;
            state.Admin = action.payload.Admin;
            state.Name = action.payload.Name;
            state.Login = action.payload.Login;
            state.StoreRef_id = action.payload.StoreRef_id;
        }
    }
})


export const { login } = User.actions;
export default User.reducer;