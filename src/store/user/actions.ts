import { Auth, Logger } from 'aws-amplify';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { UNAUTH_USER_ID } from '../../constants';
import { AppThunkAction } from '../reduxTypes';
import { getMovingEndpoints } from '../endpoints/actions';
import UsersClient from '../../clients/UsersClient';
import { loadOptions } from '../options/actions';
import { loadResource } from '../data/actions';
import { clearClientsAction, setClientsAction } from '../clients/actions';
import { clearCampaignsAction, setCampaignsAction } from '../campaigns/actions';
import * as UserStoreTypes from './types';
import { CLEAR_PACKAGES } from '../packages/types';
import { clearMetrics } from '../metrics/actions';
import portalConfig from '../../portalConfig';
import { clearAlertMessage } from '../ui/actions';
import { SNACKBAR_ALERT, SUCCESS, ERROR } from '../ui/types';

const logger = new Logger('UserStoreTypes');

interface GetAuthUserOpts {
  getCognitoUser?: boolean;
}

const setAppUserCookie = async (user: CognitoUser) => {
  const session = user.getSignInUserSession();
  if (session) {
    await UsersClient.setUserSession(session.getAccessToken().getJwtToken());
  }
  return null;
};

const getAuthUser = async (
  opts: GetAuthUserOpts,
): Promise<UserStoreTypes.CognitoUser> => {
  const { getCognitoUser = false } = opts || {};
  const authUser: UserStoreTypes.CognitoUser = await Auth.currentAuthenticatedUser();
  if (getCognitoUser) {
    return authUser;
  }

  await setAppUserCookie(authUser);
  const attributes = await Auth.userAttributes(authUser);
  const attributesMap: Record<string, string> = {};
  attributes.forEach(att => {
    attributesMap[att.getName()] = att.getValue();
  });

  authUser.attributes = attributesMap;
  return authUser;
};

export const updateViewMode = (mode: string) => ({
  type: UserStoreTypes.UPDATE_VIEW_MODE,
  mode,
});

export const updateUserId = (id: string): AppThunkAction => dispatch => {
  if (!id) {
    return Promise.resolve();
  }

  return dispatch({
    type: UserStoreTypes.UPDATE_USER_ID,
    id,
  });
};

export const clearUser = (): AppThunkAction => async dispatch => {
  dispatch({
    type: UserStoreTypes.CLEAR_USER,
  });
};

export const updateUserAttributes = (
  updatedAttributes: object,
): AppThunkAction => (dispatch, getState) => {
  const { user } = getState();
  if (!user || !user.instance) {
    return Promise.resolve();
  }

  const alertMessage = (message: string, messageType: string) => ({
    type: SNACKBAR_ALERT,
    error: { data: { message } },
    alertMessageType: messageType,
  });

  const dispatchClearAlert = () => dispatch(clearAlertMessage());
  const dispatchAlert = (message: string, messageType: string) =>
    dispatch(alertMessage(message, messageType));

  const updateComplete = (attributes?: object) => {
    setTimeout(() => {
      dispatch({ type: UserStoreTypes.UPDATED_USER_ATTRIBUTE, attributes });
    }, 1000);
  };

  dispatch({ type: UserStoreTypes.UPDATING_USER_ATTRIBUTE });

  return getAuthUser({ getCognitoUser: true })
    .then(currentUser =>
      Auth.updateUserAttributes(currentUser, updatedAttributes),
    )
    .then(() => {
      dispatchClearAlert();
      dispatchAlert('Profile updated.', SUCCESS);
      updateComplete(updatedAttributes);
    })
    .catch(err => {
      logger.warn('Failed to update user attributes', err);
      dispatchClearAlert();
      dispatchAlert(err.message, ERROR);
      updateComplete();
    });
};

export const loadUserData = (
  userId: string,
  authUser: CognitoUser,
): AppThunkAction => async dispatch => {
  dispatch(getMovingEndpoints());
  dispatch(loadOptions());
  dispatch(loadResource());

  const loadUserResponse = await UsersClient.loadUser(userId);
  const { clients = [], campaigns, ...data } = loadUserResponse.data;
  dispatch(setCampaignsAction(campaigns));
  // dispatch(setClientsAction(clients));
  dispatch({
    type: UserStoreTypes.UPDATE_USER,
    user: authUser,
    userId,
    data,
  });
};

export const resetUserLoadedAction = () => ({
  type: UserStoreTypes.USER_LOADED,
  loaded: false,
});

export const clearData = (): AppThunkAction => async dispatch => {
  dispatch(resetUserLoadedAction());
  dispatch({
    type: CLEAR_PACKAGES,
  });
  dispatch(clearCampaignsAction());
  dispatch(clearClientsAction());
  dispatch(clearMetrics());
};

export const loadAuthenticatedUser = (): AppThunkAction => async dispatch => {
  dispatch(clearData());
  try {
    const authUser = await getAuthUser({});
    logger.debug('User authenticated');
    const userId = authUser.getUsername();
    return dispatch(loadUserData(userId, authUser));
  } catch (err) {
    logger.debug('User not authenticated so setting unauth user');
  }

  return dispatch(
    loadUserData(
      UNAUTH_USER_ID,
      new CognitoUser({
        Username: UNAUTH_USER_ID,
        Pool: new CognitoUserPool({
          ClientId: portalConfig.AWS.Auth.userPoolWebClientId,
          UserPoolId: portalConfig.AWS.Auth.userPoolId,
        }),
      }),
    ),
  );
};
export const changeUserPassword = (
  oldPassword: string,
  newPassword: string,
): AppThunkAction => async dispatch => {
  const alertMessage = (message: string, messageType: string) => ({
    type: SNACKBAR_ALERT,
    error: { data: { message } },
    alertMessageType: messageType,
  });
  dispatch(clearAlertMessage());
  try {
    const authUser = await getAuthUser({ getCognitoUser: true });
    const res = await Auth.changePassword(authUser, oldPassword, newPassword);
    if (res && res === 'SUCCESS') {
      dispatch(
        alertMessage('Your password was updated successfully.', SUCCESS),
      );
    }
  } catch (error) {
    dispatch(alertMessage('We were unable to update your password.', ERROR));
  }
};
