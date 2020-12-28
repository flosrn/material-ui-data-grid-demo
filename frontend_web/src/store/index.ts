import { combineReducers } from "@reduxjs/toolkit";
import companiesReducer from "src/store/slices/companiesSlice";

const rootReducer = combineReducers({
  companies: companiesReducer,
});

export default rootReducer;
