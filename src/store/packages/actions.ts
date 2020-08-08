import { AxiosResponse } from 'axios';
import PackagesClient from '../../clients/PackagesClient';
import history from '../../history';
import { clearAlertMessage } from '../ui/actions';
import { AppThunkAction } from '../reduxTypes';
import {
  Package,
  LOADING_PACKAGES,
  LOAD_PACKAGES_DONE,
  LOAD_PACKAGE_DONE,
  CREATE_PACKAGE_REQUEST,
  CREATE_PACKAGE_SUCCESS,
  CREATE_PACKAGE_FAILURE,
  UPDATING_PACKAGE,
  UPDATE_PACKAGE_DONE,
  DELETE_PACKAGE_REQUEST,
  DELETE_PACKAGE_SUCCESS,
  DELETE_PACKAGE_FAILED,
} from './types';

import { clearClientsAction } from '../clients/actions';
import { SNACKBAR_ALERT } from '../ui/types';

function goToPackages() {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  history.push('/packages');
}

export const addPackage = (item: Package) => ({
  type: LOAD_PACKAGE_DONE,
  item,
});

export const listPackages = (
  userId: string,
  group: string,
): AppThunkAction => dispatch => {
  function request() {
    return { type: LOADING_PACKAGES };
  }

  function success(packages: Package[]) {
    return { type: LOAD_PACKAGES_DONE, packages };
  }

  function failure(error: string) {
    return { type: LOAD_PACKAGES_DONE, error };
  }

  dispatch(request());

  return PackagesClient.listPackages(userId, group)
    .then((result: Package[]) => dispatch(success(result)))
    .catch((error: string) => dispatch(failure(error)));
};

export const getPackagesForUser = (): AppThunkAction => dispatch => {
  function request() {
    return { type: LOADING_PACKAGES };
  }

  function success(packages: Package[]) {
    return { type: LOAD_PACKAGES_DONE, packages, error: '' };
  }

  function failure(error: string) {
    return { type: LOAD_PACKAGES_DONE, error };
  }

  dispatch(request());

  return PackagesClient.getPackages()
    .then((packages: Package[]) => dispatch(success(packages)))
    .catch((error: string) => dispatch(failure(error)));
};

export const createPackage = (
  newPackage: Package,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: CREATE_PACKAGE_REQUEST };
  }

  function success(payload: any) {
    return { type: CREATE_PACKAGE_SUCCESS, payload };
  }

  function failure(error: string) {
    return { type: CREATE_PACKAGE_FAILURE, error };
  }

  function alertMessage(error: AxiosResponse) {
    const { status, data } = error;
    const { message } = data;
    if (message) {
      return { type: SNACKBAR_ALERT, error };
    }
    const alertMsg =
      status === 403
        ? 'You are not allowed to create this package'
        : 'Sorry, there was a problem to create this package';
    return {
      type: SNACKBAR_ALERT,
      error: { ...error, data: { message: alertMsg } },
    };
  }

  dispatch(request());

  try {
    const result = await PackagesClient.createPackage(newPackage);
    dispatch(clearClientsAction());
    dispatch(success(result));
    goToPackages();
  } catch (ex) {
    dispatch(failure(ex));
    dispatch(alertMessage(ex.response));
  }
};

export const updatePackage = (
  updatedPackage: Package,
): AppThunkAction => dispatch => {
  function request() {
    return { type: UPDATING_PACKAGE };
  }

  function success(packages: Package[]) {
    return { type: UPDATE_PACKAGE_DONE, packages, error: '' };
  }

  function failure(error: AxiosResponse) {
    return { type: UPDATE_PACKAGE_DONE, error };
  }

  function alertMessage(error: AxiosResponse) {
    const { status, data } = error;
    const { message } = data;
    if (message) {
      return { type: SNACKBAR_ALERT, error };
    }
    const alertMsg =
      status === 403
        ? 'You are not allowed to update this package'
        : 'Sorry, there was a problem to update this package';
    return {
      type: SNACKBAR_ALERT,
      error: { ...error, data: { message: alertMsg } },
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  return PackagesClient.updatePackage(updatedPackage)
    .then((result: any) => {
      dispatch(success(result.data));
      dispatch(clearClientsAction());
      goToPackages();
    })
    .catch((error: any) => {
      dispatch(failure(error.response));
      dispatch(alertMessage(error.response));
    });
};

export const deletePackage = (
  packageId: string,
  userId: string,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: DELETE_PACKAGE_REQUEST, packageId };
  }

  function success() {
    return { type: DELETE_PACKAGE_SUCCESS, payload: { packageId } };
  }

  function failure(error: string) {
    return { type: DELETE_PACKAGE_FAILED, error };
  }

  function alertMessage(error: string) {
    const alertMsg = error || 'Failed to remove package';

    return {
      type: SNACKBAR_ALERT,
      error: alertMsg,
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  try {
    await PackagesClient.deletePackage(packageId, userId);
    dispatch(success());
  } catch (error) {
    dispatch(failure(error));
    dispatch(alertMessage(error.response));
  }
};
