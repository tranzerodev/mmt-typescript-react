import { AppThunkAction } from '../reduxTypes';
import PackagesClient from '../../clients/PackagesClient';

import {
  LOAD_EXPERIENCES_REQUEST,
  LOAD_EXPERIENCES_SUCCESS,
  LOAD_EXPERIENCES_FAILURE,
  ExperiencesResponse,
} from './types';

/* eslint-disable import/prefer-default-export */
export const getExperiences = (
  userId: string,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: LOAD_EXPERIENCES_REQUEST };
  }

  function success(experiences: ExperiencesResponse) {
    return { type: LOAD_EXPERIENCES_SUCCESS, experiences };
  }

  function failure(error: string) {
    return { type: LOAD_EXPERIENCES_FAILURE, error };
  }

  dispatch(request());

  try {
    const result = await PackagesClient.getPackages(userId);
    dispatch(success(result));
  } catch (ex) {
    dispatch(failure(ex));
  }
};
