import {
  CONTROL_LOGIN_MODAL,
  CLEAR_SNACKBAR_ALERT,
  SNACKBAR_ALERT,
  AlertMessageModel,
  SUCCESS,
} from './types';
import { AuthStateTypes } from '../../constants/authConsts';

export const clearAlertMessage = () => ({
  type: CLEAR_SNACKBAR_ALERT,
});

export const alertSnackbar = (alertMessage: AlertMessageModel) => {
  if (alertMessage && alertMessage.successMessage) {
    return {
      type: SNACKBAR_ALERT,
      error: alertMessage.successMessage,
      alertMessageType: SUCCESS,
    };
  }
  if (alertMessage && alertMessage.errorMessage) {
    return {
      type: SNACKBAR_ALERT,
      error: alertMessage.errorMessage,
    };
  }
  const { axiosError } = alertMessage;
  if (axiosError) {
    const { data, status } = axiosError;
    const { message } = data;
    if (message) {
      return { type: SNACKBAR_ALERT, message };
    }
    // List available status
    if (status === 403) {
      return {
        type: SNACKBAR_ALERT,
        error: `Sorry, you don't have permission to ${
          alertMessage && alertMessage.actionMessage
            ? alertMessage.actionMessage
            : 'do this action'
        }`,
      };
    }
    return {
      type: SNACKBAR_ALERT,
      error: `Sorry, there was a problem to ${
        alertMessage && alertMessage.actionMessage
          ? alertMessage.actionMessage
          : 'do this action'
      }`,
    };
  }
  return {
    type: SNACKBAR_ALERT,
    error: 'There was a problem to do this action',
  };
};

export const openAuthModal = (authType: AuthStateTypes) => ({
  type: CONTROL_LOGIN_MODAL,
  authType,
});

export const closeAuthModal = () => ({
  type: CONTROL_LOGIN_MODAL,
});
