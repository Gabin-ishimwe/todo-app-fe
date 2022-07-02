import { TodosActionTypes } from "../actionTypes";
import { Todo } from "../reducers/todo.reducer";

type retrieveTodoSuccess = {
  type: TodosActionTypes.RETRIEVE_TODOS_SUCESS;
  payload: object;
};

type retrieveTodoError = {
  type: TodosActionTypes.RETRIEVE_TODOS_ERROR;
  payload: object;
};

type createTodoSuccess = {
  type: TodosActionTypes.CREATE_TODO_SUCCESS;
  payload: object;
};

type createTodoError = {
  type: TodosActionTypes.CREATE_TODO_ERROR;
  payload: object;
};

type deleteTodoSuccess = {
  type: TodosActionTypes.DELETE_TODO_SUCCESS;
  payload: Todo;
};

type deleteTodoError = {
  type: TodosActionTypes.DELETE_TODO_ERROR;
  payload: object;
};

export type TodosAction =
  | retrieveTodoError
  | retrieveTodoSuccess
  | createTodoError
  | createTodoSuccess
  | deleteTodoError
  | deleteTodoSuccess;
