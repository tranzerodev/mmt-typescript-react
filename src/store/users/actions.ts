import { AxiosResponse } from 'axios';
import UsersClient from '../../clients/UsersClient';
import { clearAlertMessage } from '../ui/actions';
import { AppThunkAction } from '../reduxTypes';
import {
  LOAD_USERS_REQUEST,
  LOAD_USERS_SUCCESS,
  LOAD_USERS_FAILURE,
} from './types';
import { SNACKBAR_ALERT } from '../ui/types';

export const listUsers = (): AppThunkAction => dispatch => {
  function request() {
    return { type: LOAD_USERS_REQUEST };
  }

  function success(payload: any) {
    return { type: LOAD_USERS_SUCCESS, payload };
  }

  function failure(error: string) {
    return { type: LOAD_USERS_FAILURE, error };
  }

  function alertMessage(error: AxiosResponse) {
    let alertMsg = '';
    if (error) {
      const { data, status } = error;
      const { message } = data;
      if (message) {
        return { type: SNACKBAR_ALERT, error };
      }
      alertMsg =
        status === 403
          ? 'You are not allowed to load users'
          : 'Sorry, there was a problem to load users';
    } else {
      alertMsg = 'Failed to load users';
    }

    return {
      type: SNACKBAR_ALERT,
      error: { ...error, data: { message: alertMsg } },
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  return UsersClient.listUsers()
    .then((result: any) => dispatch(success(result)))
    .catch((error: any) => {
      dispatch(failure(error));
      dispatch(alertMessage(error.response));
    });
};

export const addUser = (): AppThunkAction => () => {
  //
};
