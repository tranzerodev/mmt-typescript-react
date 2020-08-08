import { User } from '../../constants/dataTypes';

export interface AttributeField {
  Name: string;
  Value: string;
}

export interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string;
  loadedUsers: boolean;
}

export const LOAD_USERS_REQUEST = 'LOADING_USERS';
export const LOAD_USERS_SUCCESS = 'LOAD_USERS_SUCCESS';
export const LOAD_USERS_FAILURE = 'LOAD_USERS_FAILURE';

interface StartLoadUsersAction {
  type: typeof LOAD_USERS_REQUEST;
}

interface LoadUsersDoneAction {
  type: typeof LOAD_USERS_SUCCESS;
  payload: any;
}

interface LoadUsersFailAction {
  type: typeof LOAD_USERS_FAILURE;
  error: string;
}

export type UsersActionTypes =
  | StartLoadUsersAction
  | LoadUsersDoneAction
  | LoadUsersFailAction;
