import { AxiosResponse } from 'axios';
import * as DataType from '../../constants/dataTypes';

export interface Package {
  id?: string;
  name: string;
  source?: string;
  section: string;
  dmas: string[];
  ownerId: string;
  customer: string;
  endpointIds: string[];
  startDate: string;
  endDate: string;
  budget: number;
  hours: number;
  categories: string[];
  endpointTypes: string[];
  performanceModules: string[];
  regions: string[];
  about: string;
  imagesPrimary: DataType.Image[];
  imagesSecondary: DataType.Image[];
  impressions: number;
  live: boolean;
  ['Lookup:Categories']?: string[];
}

export interface PackagesState {
  items: Package[];
  isLoading: boolean;
  error: string;
  loadedPackages: boolean;
  updatingPackage: boolean;
  removingPackage: boolean;
  removePackageId: string;
}

export const LOADING_PACKAGES = 'LOADING_PACKAGES';
export const LOAD_PACKAGES_DONE = 'LOAD_PACKAGES_DONE';
export const LOAD_PACKAGE_DONE = 'LOAD_PACKAGE_DONE';
export const CREATE_PACKAGE_REQUEST = 'CREATE_PACKAGE_REQUEST';
export const CREATE_PACKAGE_SUCCESS = 'CREATE_PACKAGE_SUCCESS';
export const CREATE_PACKAGE_FAILURE = 'CREATE_PACKAGE_FAILURE';
export const UPDATING_PACKAGE = 'UPDATING_PACKAGE';
export const UPDATE_PACKAGE_DONE = 'UPDATE_PACKAGE_DONE';
export const DELETE_PACKAGE_REQUEST = 'DELETE_PACKAGE_REQUEST';
export const DELETE_PACKAGE_SUCCESS = 'DELETE_PACKAGE_SUCCESS';
export const DELETE_PACKAGE_FAILED = 'DELETE_PACKAGE_FAILED';
export const CLEAR_PACKAGES = 'CLEAR_PACKAGES';

interface ClearPackagesAction {
  type: typeof CLEAR_PACKAGES;
}

interface StartLoadPackagesAction {
  type: typeof LOADING_PACKAGES;
}

interface LoadPackagesDoneAction {
  type: typeof LOAD_PACKAGES_DONE;
  packages: Package[];
  error: string;
}

interface LoadPackageDoneAction {
  type: typeof LOAD_PACKAGE_DONE;
  item: Package;
}

interface StartCreatePackagesAction {
  type: typeof CREATE_PACKAGE_REQUEST;
}

interface CreatePackagesDoneAction {
  type: typeof CREATE_PACKAGE_SUCCESS;
  payload: any;
}

interface CreatePackagesFailAction {
  type: typeof CREATE_PACKAGE_FAILURE;
  error: string;
}

interface StartUpdatePackagesAction {
  type: typeof UPDATING_PACKAGE;
}

interface UpdatePackagesDoneAction {
  type: typeof UPDATE_PACKAGE_DONE;
  packages: Package[];
  error: AxiosResponse;
}

interface DeletePackage {
  type: typeof DELETE_PACKAGE_REQUEST;
  packageId: string;
}

interface DeletePackageError {
  type: typeof DELETE_PACKAGE_FAILED;
  error: string;
}

interface DeletePackageSuccess {
  type: typeof DELETE_PACKAGE_SUCCESS;
  payload: { packageId: string };
}

export type PackagesActionTypes =
  | ClearPackagesAction
  | StartLoadPackagesAction
  | LoadPackagesDoneAction
  | LoadPackageDoneAction
  | StartCreatePackagesAction
  | CreatePackagesDoneAction
  | CreatePackagesFailAction
  | StartUpdatePackagesAction
  | UpdatePackagesDoneAction
  | DeletePackage
  | DeletePackageError
  | DeletePackageSuccess;
