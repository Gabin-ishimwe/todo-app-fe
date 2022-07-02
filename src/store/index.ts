import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";
import { indexReducer } from "./reducers";
import thunk from "redux-thunk";

const initialState = {};
const middlewares = [thunk];
const composeEnhancers =
  // @ts-ignore
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsDenylist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares)
  // other store enhancers if any
);
const store = createStore(indexReducer, initialState, enhancer);
export default store;
