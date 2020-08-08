import { AxiosResponse } from 'axios';
import {
  Endpoint,
  EndpointParam,
  EndpointFormValueType,
  LOAD_ENDPOINTS_BY_USER,
  LOAD_ENDPOINTS_BY_USER_SUCCESS,
  LOAD_ENDPOINTS_BY_USER_FAILURE,
  LOAD_MOVING_ENDPOINTS_BY_USER,
  // LOAD_MOVING_ENDPOINTS_BY_USER_SUCCESS,
  LOAD_MOVING_ENDPOINTS_BY_USER_FAILURE,
  LOAD_ENDPOINTS,
  LOAD_ENDPOINTS_SUCCESS,
  LOAD_ENDPOINTS_FAILURE,
  CREATE_ENDPOINT_REQUEST,
  CREATE_ENDPOINT_SUCCESS,
  CREATE_ENDPOINT_FAILURE,
} from './types';
import EndpointsClient from '../../clients/EndpointsClient';
import { AppThunkAction } from '../reduxTypes';
import { SNACKBAR_ALERT } from '../ui/types';

// eslint-disable-next-line import/prefer-default-export
export const listEndpointsByUser = (
  userId: string,
): AppThunkAction => dispatch => {
  if (!userId) {
    return Promise.resolve();
  }

  function request() {
    return { type: LOAD_ENDPOINTS_BY_USER };
  }

  function success(endpoints: Endpoint[], endpointOwnerId: string) {
    return {
      type: LOAD_ENDPOINTS_BY_USER_SUCCESS,
      endpoints,
      endpointOwnerId,
    };
  }

  function failure(error: string) {
    return { type: LOAD_ENDPOINTS_BY_USER_FAILURE, error };
  }

  dispatch(request());

  return EndpointsClient.getEndpointsByUser(userId)
    .then((result: Endpoint[]) => dispatch(success(result, userId)))
    .catch((error: string) => dispatch(failure(error)));
};

export const getMovingEndpoints = (): AppThunkAction => dispatch => {
  function request() {
    return { type: LOAD_MOVING_ENDPOINTS_BY_USER };
  }

  /* function success(movingEndpoints, endpointOwnerId) {
    return {
      type: actions.LOAD_MOVING_ENDPOINTS_BY_USER_SUCCESS,
      movingEndpoints,
      endpointOwnerId,
    };
  } */

  function failure(error: string) {
    return { type: LOAD_MOVING_ENDPOINTS_BY_USER_FAILURE, error };
  }

  dispatch(request());

  try {
    // result = await EndpointsClient.getMovingEndpointsByUser(userId);
    // dispatch(success(result, userId))
    throw Error('moving endpoint api not implemented');
  } catch (error) {
    dispatch(failure(error));
  }
};

export const getEndpoints = (
  params: EndpointParam,
  isInitalItems: boolean,
): AppThunkAction => dispatch => {
  if (!params) {
    return Promise.resolve();
  }
  function request() {
    return { type: LOAD_ENDPOINTS };
  }
  function success(options: Endpoint[]) {
    return { type: LOAD_ENDPOINTS_SUCCESS, options, error: null };
  }

  function failure(error: string) {
    return { type: LOAD_ENDPOINTS_FAILURE, options: null, error };
  }
  dispatch(request());

  if (isInitalItems) return dispatch(success([]));

  return EndpointsClient.getEndpoints(params)
    .then(async (result: Endpoint[]) => dispatch(success(result)))
    .catch((error: string) => dispatch(failure(error)));
};

export const createEndpoint = (
  newEndpoint: EndpointFormValueType,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: CREATE_ENDPOINT_REQUEST };
  }
  function success(payload: any) {
    return { type: CREATE_ENDPOINT_SUCCESS, payload };
  }

  function failure(error: string) {
    return { type: CREATE_ENDPOINT_FAILURE, error };
  }

  function alertMessage(error: AxiosResponse) {
    let alertMsg = 'Sorry, there was a problem to create new endpoint';
    if (error) {
      const { status, data } = error;
      const { message } = data;
      if (message) {
        return { type: SNACKBAR_ALERT, error };
      }
      if (status === 403) {
        alertMsg = 'You are not allowed to create new endpoint';
      }
    }

    return {
      type: SNACKBAR_ALERT,
      error: { ...error, data: { message: alertMsg } },
    };
  }
  dispatch(request());

  try {
    const result = await EndpointsClient.createEndpoint(newEndpoint);
    dispatch(success(result));
  } catch (ex) {
    dispatch(failure(ex));
    dispatch(alertMessage(ex.response));
  }
};
