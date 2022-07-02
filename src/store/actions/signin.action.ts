import { SignupActionTypes } from "../actionTypes";

type SignUpSuccess = {
  type: SignupActionTypes.SIGNIN_SUCCESS;
  payload: object;
};

type SignUpError = {
  type: SignupActionTypes.SIGNIN_ERROR;
  payload: object;
};

export type SignUpAction = SignUpSuccess | SignUpError;
