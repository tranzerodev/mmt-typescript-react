import { User } from '../../constants/dataTypes';

export interface ResourceField {
  Portals: string[];
  lastModified: string;
  ownerEmail: string;
  tags: string[];
  title: string;
  body: string;
}

export interface Resource {
  id: string;
  fields: ResourceField;
}

export interface DataState {
  resources: Resource[];
  resourceUsers: User[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string;
}

export const LOAD_RESOURCES_REQUEST = 'LOAD_RESOURCES_REQUEST';
export const LOAD_RESOURCES_DONE = 'LOAD_RESOURCES_DONE';
export const LOAD_RESOURCES_FAIL = 'LOAD_RESOURCES_FAIL';

interface StartLoadResourcesAction {
  type: typeof LOAD_RESOURCES_REQUEST;
}

interface LoadResourcesDoneAction {
  type: typeof LOAD_RESOURCES_DONE;
  resources: Resource[];
  users: User[];
}

interface LoadResourcesFailAction {
  type: typeof LOAD_RESOURCES_FAIL;
  error: string;
}

export type DataActionTypes =
  | StartLoadResourcesAction
  | LoadResourcesDoneAction
  | LoadResourcesFailAction;
