import { LoginAction } from "../actions/login.action";
import { LoginActionTypes } from "../actionTypes";
import { Dispatch } from "redux";

export const loginSuccess = (payload: object) => {
  return (dispatch: Dispatch<LoginAction>) => {
    dispatch({
      type: LoginActionTypes.LOGIN_SUCCESS,
      payload,
    });
  };
};

export const loginError = (payload: object) => {
  return (dispatch: Dispatch<LoginAction>) => {
    dispatch({
      type: LoginActionTypes.LOGIN_ERROR,
      payload,
    });
  };
};
