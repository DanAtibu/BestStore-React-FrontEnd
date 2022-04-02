import { createSlice } from "@reduxjs/toolkit";

const Stock = createSlice({
    name: "Stock",
    initialState: { List: false },
    reducers: {
        updateStock( state, action ) {
            console.log( state, action );
            state.List = action.payload;
        }
    }
});

export const { updateStock } = Stock.actions;
export default Stock.reducer;