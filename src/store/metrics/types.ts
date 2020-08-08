export const LOAD_METRICS_REQUEST = 'LOAD_METRICS_REQUEST';
export const LOAD_METRICS_SUCCESS = 'LOAD_METRICS_SUCCESS';
export const LOAD_METRICS_FAILURE = 'LOAD_METRICS_FAILURE';
export const LOAD_MOCK_METRICS = 'LOAD_MOCK_METRICS';
export const CLEAR_METRICS = 'CLEAR_METRICS';

export interface Metric {
  type: string;
  campaignId: string;
  date: string;
  value: string;
}

export interface MetricsState {
  isLoading: boolean;
  isLoaded: boolean;
  data: Metric[];
  error: string;
}

interface StartLoadMetricsAction {
  type: typeof LOAD_METRICS_REQUEST;
}

interface LoadMetricsDoneAction {
  type: typeof LOAD_METRICS_SUCCESS;
  data: Metric[];
}
interface LoadMockMetricsDoneAction {
  type: typeof LOAD_MOCK_METRICS;
  data: Metric[];
}

interface LoadMetricsFailAction {
  type: typeof LOAD_METRICS_FAILURE;
  error: string;
}
interface ClearMetricsAction {
  type: typeof CLEAR_METRICS;
}

export type MetricsActionTypes =
  | StartLoadMetricsAction
  | LoadMetricsDoneAction
  | LoadMetricsFailAction
  | LoadMockMetricsDoneAction
  | ClearMetricsAction;
