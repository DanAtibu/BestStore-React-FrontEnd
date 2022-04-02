import { createSlice } from "@reduxjs/toolkit";

const Sale = createSlice({
    name: "Sale",
    initialState: { List: false },
    reducers: {
        updateSale( state, action ) {
            console.log( state, action );
            state.List = action.payload;
        }
    }
});




export const {  updateSale } = Sale.actions;
export default Sale.reducer;
