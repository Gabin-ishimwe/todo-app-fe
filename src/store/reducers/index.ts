import { combineReducers } from "redux";
import { signUpReducer } from "./signup.reducer";
import { loginReducer } from "./login.reducer";
import { categoryReducer } from "./category.reducer";
import { todosReducer } from "./todo.reducer";

export const indexReducer = combineReducers({
  signUpReducer,
  loginReducer,
  categoryReducer,
  todosReducer,
});
export type State = ReturnType<typeof indexReducer>;
