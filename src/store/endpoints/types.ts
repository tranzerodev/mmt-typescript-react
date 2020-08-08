import PropTypes from 'prop-types';

export interface Endpoint {
  externalId: string;
  endpointId: string;
  dma: string;
  endpointType: string;
  CPH?: number;
  totalHours: number;
  availableHours: number;
  hourlyImpressions: number;
  latitude: number;
  longitude: number;
  groupSize: number;
  endpointCategory: string;
  dailyHours?: number;
  dailyUTCStartTime?: string;
  dailyUTCEndTime?: string;
  assignedTo?: string[];
}

export type EndpointFormValueType = {
  externalId?: string;
  endpointType?: [];
  dma?: [];
  endpointCategory?: string;
  isMoving?: boolean;
  latitude?: number;
  longitude?: number;
  groupSize?: number;
  hourlyImpressions?: number;
  dailyUTCStartTime: string | number;
  dailyUTCendTime: string | number;
  dailyHours?: number;
};

export type EndpointParamKey =
  | 'DMA'
  | 'region'
  | 'product'
  | 'startDate'
  | 'endDate';

export interface EndpointParam {
  dmas: string[];
  endpointTypes: string[];
  regions: string[];
  startDate: string;
  endDate: string;
}

export interface MovingEndpoint {
  treePath: string[];
  hourlyImpressions: number;
  month_1: number;
  month_2: number;
  month_3: number;
  month_4: number;
  month_5: number;
}

export const LOAD_ENDPOINTS_BY_USER = 'LOAD_ENDPOINTS_BY_USER';
export const LOAD_ENDPOINTS_BY_USER_SUCCESS = 'LOAD_ENDPOINTS_BY_USER_SUCCESS';
export const LOAD_ENDPOINTS_BY_USER_FAILURE = 'LOAD_ENDPOINTS_BY_USER_FAILURE';
export const LOAD_MOVING_ENDPOINTS_BY_USER = 'LOAD_MOVING_ENDPOINTS_BY_USER';
export const LOAD_MOVING_ENDPOINTS_BY_USER_SUCCESS =
  'LOAD_MOVING_ENDPOINTS_BY_USER_SUCCESS';
export const LOAD_MOVING_ENDPOINTS_BY_USER_FAILURE =
  'LOAD_MOVING_ENDPOINTS_BY_USER_FAILURE';
export const LOAD_ENDPOINTS = 'LOAD_ENDPOINTS';
export const LOAD_ENDPOINTS_SUCCESS = 'LOAD_ENDPOINTS_SUCCESS';
export const LOAD_ENDPOINTS_FAILURE = 'LOAD_ENDPOINTS_FAILURE';
export const CREATE_ENDPOINT_REQUEST = 'CREATE_ENDPOINT_REQUEST';
export const CREATE_ENDPOINT_SUCCESS = 'CREATE_ENDPOINT_SUCCESS';
export const CREATE_ENDPOINT_FAILURE = 'CREATE_ENDPOINT_FAILURE';

interface StartLoadEndpointsByUserAction {
  type: typeof LOAD_ENDPOINTS_BY_USER;
}
interface LoadEndpointsByUserDoneAction {
  type: typeof LOAD_ENDPOINTS_BY_USER_SUCCESS;
  endpoints: Endpoint[];
  endpointOwnerId: string;
}
interface LoadEndpointsByUserFailAction {
  type: typeof LOAD_ENDPOINTS_BY_USER_FAILURE;
  error: string;
}
interface StartLoadMovingEndpointsByUserAction {
  type: typeof LOAD_MOVING_ENDPOINTS_BY_USER;
}
interface LoadMovingEndpointsByUserDoneAction {
  type: typeof LOAD_MOVING_ENDPOINTS_BY_USER_SUCCESS;
  movingEndpoints: MovingEndpoint[];
  endpointOwnerId: string;
}
interface LoadMovingEndpointsByUserFailAction {
  type: typeof LOAD_MOVING_ENDPOINTS_BY_USER_FAILURE;
  error: string;
}
interface StartLoadEndpointsAction {
  type: typeof LOAD_ENDPOINTS;
}
interface LoadEndpointsDoneAction {
  type: typeof LOAD_ENDPOINTS_SUCCESS;
  options: Endpoint[];
}
interface LoadEndpointsFailAction {
  type: typeof LOAD_ENDPOINTS_FAILURE;
  error: string;
}
interface StartCreateEndpointAction {
  type: typeof CREATE_ENDPOINT_REQUEST;
}
interface CreateEndpointDoneAction {
  type: typeof CREATE_ENDPOINT_SUCCESS;
  payload: any;
}
interface CreateEndpointFailAction {
  type: typeof CREATE_ENDPOINT_FAILURE;
  error: string;
}

export const endpointPropType = PropTypes.shape({});

export type EndpointsActionTypes =
  | StartLoadEndpointsByUserAction
  | LoadEndpointsByUserDoneAction
  | LoadEndpointsByUserFailAction
  | StartLoadMovingEndpointsByUserAction
  | LoadMovingEndpointsByUserDoneAction
  | LoadMovingEndpointsByUserFailAction
  | StartLoadEndpointsAction
  | LoadEndpointsDoneAction
  | LoadEndpointsFailAction
  | StartCreateEndpointAction
  | CreateEndpointDoneAction
  | CreateEndpointFailAction;
