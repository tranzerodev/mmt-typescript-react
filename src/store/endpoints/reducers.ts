import {
  EndpointsActionTypes,
  LOAD_ENDPOINTS_BY_USER,
  LOAD_ENDPOINTS_BY_USER_SUCCESS,
  LOAD_ENDPOINTS_BY_USER_FAILURE,
  LOAD_MOVING_ENDPOINTS_BY_USER,
  LOAD_MOVING_ENDPOINTS_BY_USER_SUCCESS,
  LOAD_MOVING_ENDPOINTS_BY_USER_FAILURE,
  LOAD_ENDPOINTS,
  LOAD_ENDPOINTS_SUCCESS,
  LOAD_ENDPOINTS_FAILURE,
  CREATE_ENDPOINT_REQUEST,
  CREATE_ENDPOINT_SUCCESS,
  CREATE_ENDPOINT_FAILURE,
} from './types';
import mockEndpoints from '../mockData/endpoints.json';
import mockMovingEndpoints from '../mockData/movingEndpoints.json';
import mockProducts from '../mockData/products.json';
import portalConfig from '../../portalConfig';

const ENDPOINT_OWNER_TYPES = {
  PACKAGE: 'PACKAGE',
  NETWORK_OPERATOR: 'NETWORK_OPERATOR',
};

const initialState = {
  endpointOwnerType: null,
  endpointOwnerId: null,
  items: portalConfig.useMockEndpoints ? mockEndpoints : [],
  loadingEndpoints: false,
  loadingMoveEndpoints: false,
  loadedEndpoints: false,
  loadedMovingEndpoints: false,
  loadingEndpointTypes: false,
  updatingEndpoint: false,
  endpointTypes: {
    formats: [{}],
    screenTypes: portalConfig.useMockProducts ? mockProducts : [],
  },
  movingEndpoints: [],
  error: null,
};

export const endpointsReducer = (
  state = initialState,
  action: EndpointsActionTypes,
) => {
  switch (action.type) {
    case LOAD_ENDPOINTS_BY_USER:
      return {
        ...state,
        loadingEndpoints: true,
        error: null,
      };
    case LOAD_ENDPOINTS_BY_USER_SUCCESS: {
      const { endpoints, endpointOwnerId } = action;
      return {
        ...state,
        loadingEndpoints: false,
        loadedEndpoints: true,
        items: portalConfig.useMockEndpoints ? mockEndpoints : endpoints,
        endpointOwnerType: ENDPOINT_OWNER_TYPES.NETWORK_OPERATOR,
        endpointOwnerId,
      };
    }
    case LOAD_ENDPOINTS_BY_USER_FAILURE: {
      const { error } = action;
      return {
        ...state,
        loadingEndpoints: false,
        loadedEndpoints: false,
        error,
      };
    }
    case LOAD_MOVING_ENDPOINTS_BY_USER:
      return {
        ...state,
        loadingMoveEndpoints: true,
        error: null,
      };
    case LOAD_MOVING_ENDPOINTS_BY_USER_SUCCESS: {
      const { movingEndpoints, endpointOwnerId } = action;
      return {
        ...state,
        loadingMoveEndpoints: false,
        movingEndpoints:
          movingEndpoints ||
          (portalConfig.useMockMovingEndpoints ? mockMovingEndpoints : []),
        endpointOwnerId,
      };
    }
    case LOAD_MOVING_ENDPOINTS_BY_USER_FAILURE: {
      const { error } = action;
      return {
        ...state,
        loadingMoveEndpoints: false,
        loadedMovingEndpoints: true, // Moving Endpoint API isn't ready
        error,
        movingEndpoints: portalConfig.useMockMovingEndpoints
          ? mockMovingEndpoints
          : [],
      };
    }
    case LOAD_ENDPOINTS:
      return {
        ...state,
        loadingEndpoints: true,
        loadedEndpoints: false,
        error: null,
      };
    case LOAD_ENDPOINTS_SUCCESS: {
      const { options } = action;
      return {
        ...state,
        loadingEndpoints: false,
        items: options,
      };
    }
    case LOAD_ENDPOINTS_FAILURE: {
      const { error } = action;
      return {
        ...state,
        loadingEndpoints: false,
        error,
      };
    }
    case CREATE_ENDPOINT_REQUEST:
      return {
        ...state,
        updatingEndpoint: true,
        error: '',
      };
    case CREATE_ENDPOINT_SUCCESS: {
      const newEndpoint = action.payload.data;
      const { items } = state;
      const updatedItems = items.concat(newEndpoint);
      return {
        ...state,
        updatingEndpoint: false,
        items: portalConfig.useMockEndpoints ? mockEndpoints : updatedItems,
        error: '',
      };
    }
    case CREATE_ENDPOINT_FAILURE: {
      const { error } = action;
      return {
        ...state,
        updatingEndpoint: false,
        error,
      };
    }

    default:
      return state;
  }
};

export default endpointsReducer;
