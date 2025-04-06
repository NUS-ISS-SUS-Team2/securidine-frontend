import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import orderReducer from "./reducers/orderReducer";

const rootReducer = combineReducers({
    user: userReducer,
    order: orderReducer,
});

export default rootReducer;
