import * as SettingTypes from './types';

const initialState: SettingTypes.SettingsState = {
  updatingPayment: false,
  updatingPaymentError: '',
  invoices: [],
  paymentInfo: {
    id: '',
    ownerId: '',
    customerId: '',
    subscriptionId: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      // eslint-disable-next-line @typescript-eslint/camelcase
      postal_code: '',
      country: '',
    },
    createDate: '',
  },
  loadError: '',
  loading: false,
  loaded: false,
};

export default function settingsReducer(
  state = initialState,
  action: SettingTypes.SettingsActions,
) {
  switch (action.type) {
    case SettingTypes.UPDATE_PAYMENT_START:
      return {
        ...state,
        updatingPayment: true,
      };
    case SettingTypes.UPDATE_PAYMENT_SUCCESS: {
      const paymentInfo = action.data || initialState.paymentInfo;
      return {
        ...state,
        updatingPayment: false,
        paymentInfo,
      };
    }
    case SettingTypes.UPDATE_PAYMENT_FAIL:
      return {
        ...state,
        updatingPayment: false,
        updatingPaymentError: action.error,
      };
    case SettingTypes.LOAD_SETTINGS_START:
      return {
        ...state,
        loading: true,
        loaded: false,
      };
    case SettingTypes.LOAD_SETTINGS_ERROR:
      return {
        ...state,
        loadError: action.error,
        loading: false,
        loaded: false,
      };
    case SettingTypes.LOAD_SETTINGS_DONE:
      return {
        ...state,
        ...action.data,
        loading: false,
        loaded: true,
      };
    case SettingTypes.CLEAR_SETTINGS:
      return initialState;
    default:
      return state;
  }
}
