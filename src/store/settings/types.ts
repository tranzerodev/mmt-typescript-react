import { Address, StripeInvoice } from '../../constants/dataTypes';

export const CLEAR_SETTINGS = 'CLEAR_SETTINGS';
export const UPDATE_PAYMENT_SUCCESS = 'UPDATE_SUBSCRIPTION';
export const UPDATE_PAYMENT_START = 'UPDATE_PAYMENT_START';
export const UPDATE_PAYMENT_FAIL = 'UPDATE_PAYMENT_FAIL';
export const LOAD_SETTINGS_START = 'LOAD_SETTINGS_START';
export const LOAD_SETTINGS_ERROR = 'LOAD_SETTINGS_ERROR';
export const LOAD_SETTINGS_DONE = 'LOAD_SETTINGS_DONE';

export interface SettingsState {
  updatingPayment: boolean;
  updatingPaymentError: string;
  paymentInfo: PaymentInfo;
  invoices: StripeInvoice[];
  loadError: string;
  loading: boolean;
  loaded: boolean;
}

export interface PaymentInfo {
  id: string;
  ownerId: string;
  customerId: string;
  address: Address;
  subscriptionId: string;
  accountId: string;
  businessName: string;
  createDate: string;
}

export interface UpdatePaymentSuccess {
  type: typeof UPDATE_PAYMENT_SUCCESS;
  data: PaymentInfo;
}

export interface UpdatePaymentFail {
  type: typeof UPDATE_PAYMENT_FAIL;
  error: string;
}

export interface UpdatePaymentStart {
  type: typeof UPDATE_PAYMENT_START;
}

export interface LoadSettingsStartAction {
  type: typeof LOAD_SETTINGS_START;
}

export interface LoadSettingsErrorAction {
  type: typeof LOAD_SETTINGS_ERROR;
  error: string;
}

export interface LoadSettingsDoneAction {
  type: typeof LOAD_SETTINGS_DONE;
  data: { invoices: StripeInvoice[]; paymentInfo?: PaymentInfo };
}

export interface ClearSettingsAction {
  type: typeof CLEAR_SETTINGS;
}

export type SettingsActions =
  | UpdatePaymentStart
  | UpdatePaymentSuccess
  | UpdatePaymentFail
  | LoadSettingsStartAction
  | LoadSettingsErrorAction
  | LoadSettingsDoneAction
  | ClearSettingsAction;
