import { createSlice } from "@reduxjs/toolkit";


const store = createSlice({
    name: "ProductStore",
    initialState: { List: false, selected_product: [] },
    reducers: {
        updateProduct ( state, action ) {
            state.List = action.payload;
        },
        select_product (state, action) {
            let item = action.payload.Product;
            let IsIn = state.selected_product.find( item_ => item_.id === item.id );
            if ( !IsIn ) {
                state.selected_product.push( item );
            }

            if ( !action.payload.checked ) {
                state.selected_product = state.selected_product.filter( item_ => item_.id !== item.id );
            }     
        },
        commit_product ( state, action ) {
            state.selected_product = state.selected_product.map( item_ => {
                if ( item_.id === action.payload.id ) item_ = action.payload
                return item_;
            });
            console.log( action.payload.Item );
        }
    }
});


export const { updateProduct, select_product, commit_product } = store.actions;
export default store.reducer;