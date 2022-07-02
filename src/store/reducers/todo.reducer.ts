import { TodosAction } from "../actions/todo.action";
import { TodosActionTypes } from "../actionTypes";

export type Todo = {
  id?: number;
  title?: string;
  description?: string;
  isDone?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user?: {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  category: {
    id?: number;
    name?: string;
  };
};

export type TodoState = {
  error: object | null;
  loading: boolean | null;
  allTodos: {
    count: number;
    tasks: [Todo];
  } | null;
  todo: Todo | null;
};

const initialState: TodoState = {
  error: null,
  loading: true,
  allTodos: null,
  todo: null,
};

export const todosReducer = (state = initialState, action: TodosAction) => {
  switch (action.type) {
    case TodosActionTypes.RETRIEVE_TODOS_SUCESS:
      return {
        ...state,
        loading: false,
        allTodos: action.payload,
      };
    case TodosActionTypes.RETRIEVE_TODOS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case TodosActionTypes.CREATE_TODO_SUCCESS:
      return {
        ...state,
        loading: false,
        todo: action.payload,
        allTodos: {
          ...state.allTodos,
          tasks: [...(state.allTodos?.tasks as [Todo]), action.payload],
        },
      };

    case TodosActionTypes.DELETE_TODO_SUCCESS:
      return {
        ...state,
        loading: false,
        allTodos: {
          ...state.allTodos,
          tasks: (state.allTodos?.tasks as [Todo]).filter(
            (todo: Todo) => todo.id !== action.payload.id
          ),
        },
      };

    case TodosActionTypes.DELETE_TODO_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
