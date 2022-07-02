import { SignUpAction } from "../actions/signin.action";
import { SignupActionTypes } from "../actionTypes";
import { Dispatch } from "redux";

export const signUpSuccess = (payload: object) => {
  return (dispatch: Dispatch<SignUpAction>) => {
    dispatch({
      type: SignupActionTypes.SIGNIN_SUCCESS,
      payload,
    });
  };
};

export const signUpError = (payload: object) => {
  return (dispatch: Dispatch<SignUpAction>) => {
    dispatch({
      type: SignupActionTypes.SIGNIN_ERROR,
      payload,
    });
  };
};
