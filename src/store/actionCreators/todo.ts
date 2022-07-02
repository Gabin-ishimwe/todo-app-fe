import { TodosAction } from "../actions/todo.action";
import { TodosActionTypes } from "../actionTypes";
import { Dispatch } from "redux";
import { Todo } from "../reducers/todo.reducer";

export const retrieveTodoSuccess = (payload: object) => {
  return (dispatch: Dispatch<TodosAction>) => {
    dispatch({
      type: TodosActionTypes.RETRIEVE_TODOS_SUCESS,
      payload,
    });
  };
};

export const retrieveTodoError = (payload: object) => {
  return (dispatch: Dispatch<TodosAction>) => {
    dispatch({
      type: TodosActionTypes.RETRIEVE_TODOS_ERROR,
      payload,
    });
  };
};

export const createTodoSuccess = (payload: object) => {
  return (dispatch: Dispatch<TodosAction>) => {
    dispatch({
      type: TodosActionTypes.CREATE_TODO_SUCCESS,
      payload,
    });
  };
};

export const createTodoError = (payload: object) => {
  return (dispatch: Dispatch<TodosAction>) => {
    dispatch({
      type: TodosActionTypes.CREATE_TODO_ERROR,
      payload,
    });
  };
};

export const deleteTodoSuccess = (payload: Todo) => {
  return (dispatch: Dispatch<TodosAction>) => {
    dispatch({
      type: TodosActionTypes.DELETE_TODO_SUCCESS,
      payload,
    });
  };
};

export const deleteTodoError = (payload: object) => {
  return (dispatch: Dispatch<TodosAction>) => {
    dispatch({
      type: TodosActionTypes.DELETE_TODO_ERROR,
      payload,
    });
  };
};
