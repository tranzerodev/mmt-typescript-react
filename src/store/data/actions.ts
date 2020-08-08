import { DataClient } from '../../clients';
import {
  Resource,
  LOAD_RESOURCES_REQUEST,
  LOAD_RESOURCES_DONE,
  LOAD_RESOURCES_FAIL,
} from './types';
import { User } from '../../constants/dataTypes';
import { AppThunkAction } from '../reduxTypes';

export const loadResource = (): AppThunkAction => async dispatch => {
  function request() {
    return { type: LOAD_RESOURCES_REQUEST };
  }

  function success(resources: Resource[], users: User[]) {
    return { type: LOAD_RESOURCES_DONE, resources, users };
  }

  function failure(error: string) {
    return { type: LOAD_RESOURCES_FAIL, error };
  }

  dispatch(request());

  try {
    const result = await DataClient.getResources();
    dispatch(success(result.resources, result.users));
  } catch (ex) {
    dispatch(failure(ex));
  }
};

export const saveResources = (
  items: Resource[],
): AppThunkAction => async dispatch => {
  // call Client to POST/PUT resource
  console.info('Calling save resource api with', items);
};
