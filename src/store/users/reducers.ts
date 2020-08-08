import {
  UsersState,
  UsersActionTypes,
  LOAD_USERS_REQUEST,
  LOAD_USERS_SUCCESS,
  LOAD_USERS_FAILURE,
} from './types';

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: '',
  loadedUsers: false,
};

const usersReducer = (state = initialState, action: UsersActionTypes) => {
  switch (action.type) {
    case LOAD_USERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case LOAD_USERS_SUCCESS: {
      const users = action.payload.data;
      return {
        ...state,
        isLoading: false,
        loadedUsers: true,
        users,
        error: '',
      };
    }
    case LOAD_USERS_FAILURE: {
      const { error } = action;
      return {
        ...state,
        isLoading: false,
        loadedUsers: false,
        error,
      };
    }
    default:
      return state;
  }
};

export default usersReducer;
