import mockData from '../mockData/metrics';
import portalConfig from '../../portalConfig';
import {
  MetricsState,
  MetricsActionTypes,
  LOAD_METRICS_REQUEST,
  LOAD_METRICS_SUCCESS,
  LOAD_METRICS_FAILURE,
  LOAD_MOCK_METRICS,
  CLEAR_METRICS,
} from './types';

const initialState: MetricsState = {
  isLoading: false,
  isLoaded: false,
  data: portalConfig.useMockMetrics ? mockData : [],
  error: '',
};

const metricsReducer = (state = initialState, action: MetricsActionTypes) => {
  switch (action.type) {
    case LOAD_METRICS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case LOAD_METRICS_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        data,
      };
    }
    case LOAD_MOCK_METRICS: {
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        data: portalConfig.useMockMetrics ? mockData : [],
      };
    }
    case CLEAR_METRICS: {
      return {
        ...state,
        isLoaded: false,
        data: [],
      };
    }
    case LOAD_METRICS_FAILURE: {
      const { error } = action;
      return {
        ...state,
        isLoading: false,
        isLoaded: false,
        error,
      };
    }
    default:
      return state;
  }
};

export default metricsReducer;
