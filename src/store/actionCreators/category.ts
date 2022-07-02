import { CategoryActionTypes } from "../actionTypes/index";
import { CategoryAction } from "../actions/category.action";
import { Dispatch } from "redux";

export const createCategorySuccess = (payload: object) => {
  return (dispatch: Dispatch<CategoryAction>) => {
    dispatch({
      type: CategoryActionTypes.CREATE_CATEGORY_SUCCESS,
      payload,
    });
  };
};

export const createCategoryError = (payload: object) => {
  return (dispatch: Dispatch<CategoryAction>) => {
    dispatch({
      type: CategoryActionTypes.CREATE_CATEGORY_ERROR,
      payload,
    });
  };
};

export const retrieveCategorySuccess = (payload: object) => {
  return (dispatch: Dispatch<CategoryAction>) => {
    dispatch({
      type: CategoryActionTypes.RETRIEVE_CATEGORIES_SUCCESS,
      payload,
    });
  };
};

export const retrieveCategoryError = (payload: object) => {
  return (dispatch: Dispatch<CategoryAction>) => {
    dispatch({
      type: CategoryActionTypes.RETRIEVE_CATEGORIES_ERROR,
      payload,
    });
  };
};
