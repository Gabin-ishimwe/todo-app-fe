import { LoginActionTypes } from "../actionTypes";

type LoginSuccess = {
  type: LoginActionTypes.LOGIN_SUCCESS;
  payload: object;
};

type LoginError = {
  type: LoginActionTypes.LOGIN_ERROR;
  payload: object;
};

export type LoginAction = LoginSuccess | LoginError;
