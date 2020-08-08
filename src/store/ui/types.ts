import { AxiosResponse } from 'axios';
import { AuthStateTypes } from '../../constants/authConsts';

export const CONTROL_LOGIN_MODAL = 'CONTROL_LOGIN_MODAL';
export const SNACKBAR_ALERT = 'SNACKBAR_ALERT';
export const CLEAR_SNACKBAR_ALERT = 'CLEAR_SNACKBAR_ALERT';
export const ERROR = 'ERROR';
export const SUCCESS = 'SUCCESS';
export const INFO = 'INFO';
export const WARNING = 'WARNING';

export interface UiState {
  authType: AuthStateTypes | null;
  alertMessageType: string;
  alertMessage: string;
}

export interface AuthAction {
  type: typeof CONTROL_LOGIN_MODAL;
  authType: AuthStateTypes;
}

export interface AlertAction {
  type: typeof SNACKBAR_ALERT;
  error: string;
  alertMessageType: string;
}

export interface ClearAlertAction {
  type: typeof CLEAR_SNACKBAR_ALERT;
}

export interface AlertMessageModel {
  axiosError?: AxiosResponse;
  successMessage?: string;
  errorMessage?: string;
  actionMessage?: string;
}

export type AuthActionTypes = AuthAction | AlertAction | ClearAlertAction;
