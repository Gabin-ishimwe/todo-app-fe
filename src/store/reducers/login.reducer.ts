import { LoginAction } from "../actions/login.action";
import { LoginActionTypes } from "../actionTypes";

const initialState = {
  error: null,
  data: null,
  loading: true,
};

export const loginReducer = (state = initialState, action: LoginAction) => {
  switch (action.type) {
    case LoginActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case LoginActionTypes.LOGIN_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
