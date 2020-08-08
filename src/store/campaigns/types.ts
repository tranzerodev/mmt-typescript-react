import * as DataType from '../../constants/dataTypes';

export interface Campaign {
  id: string;
  advertiserId: string;
  name: string;
  source: string;
  type?: string;
  campaignName?: string;
  customer: string;
  status: string;
  createdDate: string;
  updatedDate?: string;
  experienceId?: string;
  endpointIds: string[];
  packageId?: string;
  performanceModules: DataType.CampaignPerformanceModule[];
  dmas: string[];
  formats: string[];
  endpointTypes: string[];
  budget?: number;
  hours: number;
  regions: string[];
  description?: string;
  startDate: string;
  endDate: string;
  creativeUrls?: DataType.CampaignCreativeUrlObject[];
  deletedUrls?: DataType.CampaignCreativeUrlObject[];
  creativeFiles?: DataType.CampaignCreativeFileObject[];
}

export interface CampaignsState {
  isLoading: boolean;
  data: Campaign[];
  error: string;
  options: [];
  optionsError: '';
  updating: boolean;
  updatingError: '';
  reservingPackage: boolean;
  reservedCampaign: Campaign | null;
  reservingExperienceError: '';
  isListLoaded: boolean;
}

export const LOAD_CAMPAIGNS_REQUEST = 'LOAD_CAMPAIGNS_REQUEST';
export const LOAD_CAMPAIGNS_SUCCESS = 'LOAD_CAMPAIGNS_SUCCESS';
export const LOAD_CAMPAIGNS_FAILURE = 'LOAD_CAMPAIGNS_FAILURE';
export const LOAD_CAMPAIGN_REQUEST = 'LOAD_CAMPAIGN_REQUEST';
export const LOAD_CAMPAIGN_SUCCESS = 'LOAD_CAMPAIGN_SUCCESS';
export const LOAD_CAMPAIGN_FAILURE = 'LOAD_CAMPAIGN_FAILURE';
export const CREATE_CAMPAIGN_REQUEST = 'CREATE_CAMPAIGN_REQUEST';
export const CREATE_CAMPAIGN_SUCCESS = 'CREATE_CAMPAIGN_SUCCESS';
export const CREATE_CAMPAIGN_FAILURE = 'CREATE_CAMPAIGN_FAILURE';
export const UPDATE_CAMPAIGN_REQUEST = 'UPDATE_CAMPAIGN_REQUEST';
export const UPDATE_CAMPAIGN_SUCCESS = 'UPDATE_CAMPAIGN_SUCCESS';
export const UPDATE_CAMPAIGN_FAILURE = 'UPDATE_CAMPAIGN_FAILURE';
export const RESERVING_PACKAGE = 'RESERVING_PACKAGE';
export const RESERVING_DONE = 'RESERVING_DONE';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';
export const CLEAR_CAMPAIGNS = 'CAMPAIGN_CLEAR';
export const DELETE_CAMPAIGN_REQUEST = 'DELETE_CAMPAIGN_REQUEST';
export const DELETE_CAMPAIGN_SUCCESS = 'DELETE_CAMPAIGN_SUCCESS';
export const DELETE_CAMPAIGN_FAILURE = 'DELETE_CAMPAIGN_FAILURE';
export const CLEAR_RESERVED_CAMPAIGN = 'CLEAR_RESERVED_CAMPAIGN';

interface ClearCampaignsAction {
  type: typeof CLEAR_CAMPAIGNS;
}

interface ClearReserveCampaignAction {
  type: typeof CLEAR_RESERVED_CAMPAIGN;
}

interface StartLoadCampaignsAction {
  type: typeof LOAD_CAMPAIGNS_REQUEST;
}

interface LoadCampaignsDoneAction {
  type: typeof LOAD_CAMPAIGNS_SUCCESS;
  campaigns: Campaign[];
}

interface LoadCampaignsFailAction {
  type: typeof LOAD_CAMPAIGNS_FAILURE;
  error: string;
}

interface StartLoadCampaignAction {
  type: typeof LOAD_CAMPAIGN_REQUEST;
}

interface LoadCampaignDoneAction {
  type: typeof LOAD_CAMPAIGN_SUCCESS;
  campaign: Campaign[];
}

interface LoadCampaignFailAction {
  type: typeof LOAD_CAMPAIGN_FAILURE;
  error: string;
}

interface StartCreateCampaignAction {
  type: typeof CREATE_CAMPAIGN_REQUEST;
}

interface CreateCampaignDoneAction {
  type: typeof CREATE_CAMPAIGN_SUCCESS;
  campaigns: Campaign[];
}

interface CreateCampaignFailAction {
  type: typeof CREATE_CAMPAIGN_FAILURE;
  error: string;
}

interface UpdateCreateCampaignAction {
  type: typeof UPDATE_CAMPAIGN_REQUEST;
}

interface UpdateCampaignDoneAction {
  type: typeof UPDATE_CAMPAIGN_SUCCESS;
  campaigns: Campaign[];
}

interface UpdateCampaignFailAction {
  type: typeof UPDATE_CAMPAIGN_FAILURE;
  error: string;
}

interface StartReservePackageAction {
  type: typeof RESERVING_PACKAGE;
}
interface ReservePackageDoneAction {
  type: typeof RESERVING_DONE;
  campaign: Campaign[];
  error: string;
}

interface ClearCampaignErrorAction {
  type: typeof CLEAR_ERRORS;
}

interface DeleteCampaignAction {
  type: typeof DELETE_CAMPAIGN_REQUEST;
}

interface DeleteCampaignDoneAction {
  type: typeof DELETE_CAMPAIGN_SUCCESS;
  campaignId: string;
}

interface DeleteCampaignFailAction {
  type: typeof DELETE_CAMPAIGN_FAILURE;
  error: string;
}

export type CampaignsActionTypes =
  | ClearCampaignsAction
  | ClearReserveCampaignAction
  | StartLoadCampaignsAction
  | LoadCampaignsDoneAction
  | LoadCampaignsFailAction
  | StartLoadCampaignAction
  | LoadCampaignDoneAction
  | LoadCampaignFailAction
  | StartCreateCampaignAction
  | CreateCampaignDoneAction
  | CreateCampaignFailAction
  | UpdateCreateCampaignAction
  | UpdateCampaignDoneAction
  | UpdateCampaignFailAction
  | StartReservePackageAction
  | ReservePackageDoneAction
  | ClearCampaignErrorAction
  | DeleteCampaignAction
  | DeleteCampaignDoneAction
  | DeleteCampaignFailAction;
