import { combineReducers } from "redux";

import cacheReducer from "./cache/reducer";

export default combineReducers({
  cache: cacheReducer,
});
