import { SignupActionTypes } from "../actionTypes";
import { SignUpAction } from "../actions/signin.action";

const initialState = {
  error: null,
  data: null,
  loading: true,
};

export const signUpReducer = (state = initialState, action: SignUpAction) => {
  switch (action.type) {
    case SignupActionTypes.SIGNIN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case SignupActionTypes.SIGNIN_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};
