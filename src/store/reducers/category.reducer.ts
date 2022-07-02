import { CategoryActionTypes } from "../actionTypes";
import { CategoryAction } from "../actions/category.action";

export type Category = {
  id: number | null;
  name: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type CategoryState = {
  error: null;
  category: Category | null;
  loading: boolean;
  allCategories: { categories: [Category] } | null;
};

const initialState: CategoryState = {
  error: null,
  category: null,
  loading: true,
  allCategories: null,
};

export const categoryReducer = (
  state = initialState,
  action: CategoryAction
) => {
  switch (action.type) {
    case CategoryActionTypes.CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        category: action.payload,
        loading: false,
        allCategories: {
          categories: [
            ...(state.allCategories?.categories as [Category]),
            action.payload,
          ],
        },
      };
    case CategoryActionTypes.CREATE_CATEGORY_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CategoryActionTypes.RETRIEVE_CATEGORIES_SUCCESS:
      return {
        ...state,
        allCategories: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
