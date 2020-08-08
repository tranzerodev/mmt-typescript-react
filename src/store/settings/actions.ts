import * as SettingTypes from './types';
import { AppThunkAction } from '../reduxTypes';
import UsersClient from '../../clients/UsersClient';
import { Address, StripeInvoice } from '../../constants/dataTypes';

export const UpdatePaymentStartAction = () => ({
  type: SettingTypes.UPDATE_PAYMENT_START,
});

export const SetPaymentInfo: (
  paymentInfo: SettingTypes.PaymentInfo,
) => SettingTypes.UpdatePaymentSuccess = paymentInfo => ({
  type: SettingTypes.UPDATE_PAYMENT_SUCCESS,
  data: paymentInfo,
});

export const UpdatePaymentFailAction = (message: string) => ({
  type: SettingTypes.UPDATE_PAYMENT_FAIL,
  error: message,
});

export const UpdatePaymentInfo = (
  token: string,
  id: string,
  address: Address,
): AppThunkAction => async (dispatch, getState) => {
  const { user } = getState();
  if (
    !user ||
    !user.instance ||
    !user.instance.attributes ||
    !user.instance.attributes.email
  ) {
    dispatch(UpdatePaymentFailAction('User Information Missing'));
    return;
  }

  dispatch(UpdatePaymentStartAction());
  const { data } = await UsersClient.createCardToken({
    userId: user.id,
    email: user.instance.attributes.email,
    token,
  });
  if (data && data.customerId) {
    const response = await UsersClient.SavePaymentInfo(
      user.id,
      id,
      data.customerId,
      address,
    );
    dispatch(SetPaymentInfo(response));
  } else {
    dispatch(UpdatePaymentFailAction('Unable to save card'));
  }
};

export const LoadSettingsStartAction = () => ({
  type: SettingTypes.LOAD_SETTINGS_START,
});

export const LoadSettingsErrorAction = (message: string) => ({
  type: SettingTypes.LOAD_SETTINGS_ERROR,
  error: message,
});

export const LoadSettingsDone: (
  invoices: StripeInvoice[],
  paymentInfo?: SettingTypes.PaymentInfo,
) => SettingTypes.LoadSettingsDoneAction = (invoices, paymentInfo) => {
  const data = { invoices, paymentInfo };

  return {
    type: SettingTypes.LOAD_SETTINGS_DONE,
    data,
  };
};

export const LoadSettings = (): AppThunkAction => async (
  dispatch,
  getState,
) => {
  const { user } = getState();
  dispatch(LoadSettingsStartAction());

  try {
    const response = await UsersClient.GetSettings(user.id);
    dispatch(LoadSettingsDone(response.invoices, response.paymentInfo));
  } catch (err) {
    const message = err.data
      ? err.data.message
      : 'Unexpected error loading settings';
    dispatch(LoadSettingsErrorAction(message));
  }
};

export const ClearSettings: () => SettingTypes.ClearSettingsAction = () => ({
  type: SettingTypes.CLEAR_SETTINGS,
});
