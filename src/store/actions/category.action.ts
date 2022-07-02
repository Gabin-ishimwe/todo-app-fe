import { CategoryActionTypes } from "../actionTypes";
import { Category } from "../reducers/category.reducer";

type CreateCategorySuccess = {
  type: CategoryActionTypes.CREATE_CATEGORY_SUCCESS;
  payload: object;
};

type CreateCategoryError = {
  type: CategoryActionTypes.CREATE_CATEGORY_ERROR;
  payload: object;
};

type RetrieveCategoriesSuccess = {
  type: CategoryActionTypes.RETRIEVE_CATEGORIES_SUCCESS;
  payload: object;
};

type RetrieveCategoryError = {
  type: CategoryActionTypes.RETRIEVE_CATEGORIES_ERROR;
  payload: object;
};

export type CategoryAction =
  | CreateCategoryError
  | CreateCategorySuccess
  | RetrieveCategoriesSuccess
  | RetrieveCategoryError;
