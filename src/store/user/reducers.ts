import PropTypes from 'prop-types';

import { UNAUTH_USER_ID } from '../../constants';

import * as UserStoreTypes from './types';

export const isUnAuthUser = (id: string) => id === UNAUTH_USER_ID;

export const advertiserPropType = PropTypes.shape({
  id: PropTypes.string,
  properties: PropTypes.object,
});

export const userPropType = PropTypes.shape({
  loaded: PropTypes.bool,
  id: PropTypes.string,
  instance: PropTypes.object,
  updatingAttributes: PropTypes.bool,
  updatingPayment: PropTypes.bool,
  isUnAuth: PropTypes.bool,
  data: PropTypes.shape({
    advertiserId: PropTypes.string,
    credits: PropTypes.array,
    groups: PropTypes.array,
  }),
});

export const initialState: UserStoreTypes.UserState = {
  loaded: false,
  updatingAttributes: false,
  updatingPayment: false,
  isUnAuth: false,
  data: null,
  instance: null,
  viewMode: 'default',
  id: '',
};

export const isUserInGroup = (
  user: UserStoreTypes.UserState,
  groupName: string,
) => {
  try {
    return (
      user.data && user.data.groups && user.data.groups.includes(groupName)
    );
  } catch (err) {
    return false;
  }
};

const userReducer = (
  state = initialState,
  action: UserStoreTypes.UserActionTypes,
) => {
  switch (action.type) {
    case UserStoreTypes.UPDATE_USER_ID: {
      const { id } = action;

      return {
        ...state,
        id,
        loaded: false,
        isUnAuth: isUnAuthUser(id),
        viewMode: 'default',
      };
    }

    case UserStoreTypes.UPDATE_VIEW_MODE: {
      return {
        ...state,
        viewMode: action.mode,
      };
    }

    case UserStoreTypes.CLEAR_USER: {
      return {
        ...state,
        instance: {
          username: UNAUTH_USER_ID,
          attributes: {},
        },
        id: UNAUTH_USER_ID,
        loaded: true,
        updatingAttributes: false,
        updatingPayment: false,
        isUnAuth: true,
        viewMode: 'default',
      };
    }

    case UserStoreTypes.UPDATE_USER: {
      const { user, data, userId } = action;
      const id = userId || user.getUsername();

      return {
        ...state,
        instance: {
          ...user,
        },
        data,
        id,
        isUnAuth: isUnAuthUser(id),
        loaded: true,
      };
    }

    case UserStoreTypes.UPDATED_USER_ATTRIBUTE: {
      const { attributes } = action;
      const existingAttributes = state.instance
        ? state.instance.attributes
        : {};
      return {
        ...state,
        instance: {
          ...state.instance,
          attributes: {
            ...existingAttributes,
            ...attributes,
          },
        },
        updatingAttributes: false,
      };
    }

    case UserStoreTypes.UPDATING_USER_ATTRIBUTE: {
      return {
        ...state,
        updatingAttributes: true,
      };
    }

    case UserStoreTypes.UPDATING_USER_PAYMENT: {
      return {
        ...state,
        updatingPayment: true,
      };
    }

    case UserStoreTypes.UPDATED_USER_PAYMENT: {
      const { paymentAttributes, error } = action;
      const existingAttributes = state.instance
        ? state.instance.attributes
        : {};

      if (
        !error &&
        paymentAttributes &&
        Object.keys(paymentAttributes).length > 0
      ) {
        return {
          ...state,
          instance: {
            ...state.instance,
            attributes: {
              ...existingAttributes,
              ...paymentAttributes,
            },
          },
          updatingPayment: false,
        };
      }

      return {
        ...state,
        updatingPayment: false,
      };
    }

    case UserStoreTypes.USER_LOADED: {
      return {
        ...state,
        loaded: action.loaded,
      };
    }

    default:
      return state;
  }
};

export default userReducer;
