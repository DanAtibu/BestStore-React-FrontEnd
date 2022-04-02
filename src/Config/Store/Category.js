import { createSlice } from "@reduxjs/toolkit";


const store = createSlice({
    name: "CategoryStore",
    initialState: { List: false, selected_category: [] },
    reducers: {
        updateCategory ( state, action ) {
            console.log( state, action );
            state.List = action.payload;
        },
        select_category (state, action) {
            let Catg = state.List.find( item => item.id === action.payload.id );
            if ( Catg && action.payload.checked && !state.selected_category.includes( Catg ) ) {
                state.selected_category = [ ...state.selected_category, Catg ]
            }
            else if ( !action.payload.checked && action.payload.id ) {
                state.selected_category = state.selected_category.filter( item => item.id !== action.payload.id );
            }
        }
    }
});


export const { updateCategory, select_category } = store.actions;
export default store.reducer;