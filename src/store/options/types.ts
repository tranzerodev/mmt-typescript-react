export type OptionKey = 'categories' | 'types' | 'dmas' | 'performanceModules';

export interface EndpointTypes {
  id: string;
  Name: string;
  'Resolution - Width': number;
  'Resolution - Height': number;
  'Dimension - Width': number;
  'Dimension - Height': number;
  'Video Supported': boolean;
  'Spot Length': string[];
  'Loop Length': number;
  Sides: number;
  'Endpoint Category': string[];
  Portals: string[];
}

export interface Options {
  categories: any;
  types: EndpointTypes[];
  dmas: any;
  performanceModules: any;
}

export interface OptionsState {
  data: Options;
  loading: boolean;
  loaded: boolean;
  error: string;
}

export const LOAD_OPTIONS = 'LOAD_OPTIONS';
export const LOAD_OPTIONS_DONE = 'LOAD_OPTIONS_DONE';
export const CLEAR_OPTIONS = 'CLEAR_OPTIONS';

interface ClearOptionsAction {
  type: typeof CLEAR_OPTIONS;
}

interface StartLoadOptionsAction {
  type: typeof LOAD_OPTIONS;
}

interface LoadOptionsDoneAction {
  type: typeof LOAD_OPTIONS_DONE;
  data: Options;
  error: string;
}

export type OptionsActionTypes =
  | ClearOptionsAction
  | StartLoadOptionsAction
  | LoadOptionsDoneAction;
