import { combineReducers } from "redux";
import synthReducer from "./features/synthSlice";

const rootReducer = combineReducers({
    synths: synthReducer
})

export default rootReducer