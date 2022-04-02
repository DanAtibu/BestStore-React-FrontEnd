import { createSlice } from "@reduxjs/toolkit";
import FireBase from "../Firebase/Query";

const Sys = createSlice({
    name: "Sys",
    initialState: {
        backend: "https://beststore001.herokuapp.com/api/",
        firebase: new FireBase(),

        sale_list_modal: false,
        category_modal: false,
        product_modal: false,
        personnel_modal: false,
        NetworkLoader: false,

        selected_product: [],
    },
    reducers: {
        toggle_sale_list_modal (state) {
            state.sale_list_modal = !state.sale_list_modal;
        },
        toggle_category_modal (state) {
            state.category_modal = !state.category_modal;
        },
        toggle_product_modal (state) {
            state.product_modal = !state.product_modal;
        },
        toggle_personnel_modal (state) {
            state.personnel_modal = !state.personnel_modal;
        },
        toggle_network_loader (state) {
            state.NetworkLoader = !state.NetworkLoader;
        }
    }
})


export const { toggle_sale_list_modal, toggle_personnel_modal, toggle_category_modal, toggle_product_modal, toggle_network_loader } = Sys.actions;
export default Sys.reducer;
