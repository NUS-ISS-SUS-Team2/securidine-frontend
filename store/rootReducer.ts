import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import orderReducer from "./reducers/orderReducer";
import restaurantReducer from "./reducers/restaurantReducer";

const rootReducer = combineReducers({
    user: userReducer,
    order: orderReducer,
    restaurant: restaurantReducer,
});

export default rootReducer;
