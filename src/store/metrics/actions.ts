import { AppThunkAction } from '../reduxTypes';
import {
  Metric,
  LOAD_METRICS_REQUEST,
  LOAD_METRICS_SUCCESS,
  LOAD_METRICS_FAILURE,
  CLEAR_METRICS,
  LOAD_MOCK_METRICS,
} from './types';

export const clearMetrics = () => ({
  type: CLEAR_METRICS,
});

export const getMockMetrics = () => ({
  type: LOAD_MOCK_METRICS,
});

// eslint-disable-next-line no-unused-vars
export const getMetrics = (
  userId: string,
  startDate: string,
  endDate: string,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: LOAD_METRICS_REQUEST };
  }

  function success(data: Metric[]) {
    return { type: LOAD_METRICS_SUCCESS, data };
  }

  function failure(error: string) {
    return { type: LOAD_METRICS_FAILURE, error };
  }

  dispatch(request());

  try {
    // TODO integrate real metrics api when BE is ready
    // const result = await MetricsApi.getLocationData(userId, startDate, endDate);
    // dispatch(success(result));

    // TODO remove below once real api is integrated
    dispatch(success([]));
  } catch (ex) {
    dispatch(failure(ex));
  }
};
