import { applyMiddleware, createStore } from "redux";
import { reducer } from "./Reducers";
import thunk from "redux-thunk";

export const store = createStore(reducer, undefined, applyMiddleware(thunk));
