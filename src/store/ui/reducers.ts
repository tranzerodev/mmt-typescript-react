import {
  AuthActionTypes,
  UiState,
  CONTROL_LOGIN_MODAL,
  SNACKBAR_ALERT,
  CLEAR_SNACKBAR_ALERT,
  ERROR,
  SUCCESS,
} from './types';

const initialState: UiState = {
  authType: null,
  alertMessageType: '',
  alertMessage: '',
};

const uiReducer = (state = initialState, action: AuthActionTypes) => {
  switch (action.type) {
    case CONTROL_LOGIN_MODAL:
      return {
        ...state,
        authType: action.authType,
      };

    case SNACKBAR_ALERT: {
      const { error, alertMessageType } = action;
      return {
        ...state,
        alertMessageType: alertMessageType || ERROR,
        alertMessage: error,
      };
    }

    case CLEAR_SNACKBAR_ALERT: {
      return {
        ...state,
        alertMessageType: '',
        alertMessage: '',
      };
    }

    default:
      return state;
  }
};

export default uiReducer;
