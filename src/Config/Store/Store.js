
import { configureStore } from "@reduxjs/toolkit";
import User from "./User";
import Category from "./Category";
import Product from "./Product";
import Stock from "./Stock";
import Sale from "./Sale";
import Utils from "./Utils";


export default configureStore({
    reducer: {
        User,
        Category,
        Product,
        Stock,
        Sale,
        Utils
    }
})




