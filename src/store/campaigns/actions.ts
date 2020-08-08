import xorWith from 'lodash/xorWith';
import isEqual from 'lodash/isEqual';
import { AxiosResponse } from 'axios';
import { openAuthModal, clearAlertMessage } from '../ui/actions';
import { CampaignApi } from '../../clients';
import { UNAUTH_USER_ID } from '../../constants';
import history from '../../history';
import { S3Utils } from '../../utils';
import * as DataType from '../../constants/dataTypes';
import { AppThunkAction } from '../reduxTypes';

import {
  Campaign,
  CLEAR_CAMPAIGNS,
  CLEAR_RESERVED_CAMPAIGN,
  LOAD_CAMPAIGNS_REQUEST,
  LOAD_CAMPAIGNS_SUCCESS,
  LOAD_CAMPAIGNS_FAILURE,
  LOAD_CAMPAIGN_REQUEST,
  LOAD_CAMPAIGN_SUCCESS,
  LOAD_CAMPAIGN_FAILURE,
  CREATE_CAMPAIGN_REQUEST,
  CREATE_CAMPAIGN_SUCCESS,
  CREATE_CAMPAIGN_FAILURE,
  UPDATE_CAMPAIGN_REQUEST,
  UPDATE_CAMPAIGN_SUCCESS,
  UPDATE_CAMPAIGN_FAILURE,
  RESERVING_PACKAGE,
  RESERVING_DONE,
  CLEAR_ERRORS,
  DELETE_CAMPAIGN_REQUEST,
  DELETE_CAMPAIGN_SUCCESS,
  DELETE_CAMPAIGN_FAILURE,
} from './types';
import { SNACKBAR_ALERT } from '../ui/types';

function goToDashboard() {
  history.push('/dashboard');
}

function uploadCreativeFiles(
  creativeFiles: DataType.CampaignCreativeFileObject[],
  userId: string,
  campaignId: string,
) {
  return Promise.all(
    creativeFiles.map(async file => {
      const uploadResult = await S3Utils.uploadAdCreative(
        userId,
        campaignId,
        file,
      );
      return {
        url: uploadResult.key,
        format: file.format,
      };
    }),
  );
}

export const clearCampaignsAction = () => ({
  type: CLEAR_CAMPAIGNS,
});

export const clearReserveCampaignAction = () => ({
  type: CLEAR_RESERVED_CAMPAIGN,
});

export const setCampaignsAction = (campaigns: Campaign[]) => ({
  type: LOAD_CAMPAIGNS_SUCCESS,
  campaigns,
});

export const getCampaigns = (): AppThunkAction => dispatch => {
  function request() {
    return { type: LOAD_CAMPAIGNS_REQUEST };
  }

  function failure(error: string) {
    return { type: LOAD_CAMPAIGNS_FAILURE, error };
  }

  function alertMessage(error: string) {
    const alertMsg = error || 'Failed to get campaigns list';

    return {
      type: SNACKBAR_ALERT,
      error: { error: alertMsg },
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  return CampaignApi.listCampaigns()
    .then((result: any) => dispatch(setCampaignsAction(result.data)))
    .catch((error: AxiosResponse) => {
      dispatch(failure(error));
      dispatch(alertMessage(error.response));
    });
};

export const loadCampaign = (
  campaignId: string,
): AppThunkAction => dispatch => {
  if (!campaignId) {
    return Promise.resolve();
  }

  function request() {
    return { type: LOAD_CAMPAIGN_REQUEST };
  }

  function success(campaign: Campaign) {
    return {
      type: LOAD_CAMPAIGN_SUCCESS,
      campaign,
    };
  }

  function failure(error: string) {
    return { type: LOAD_CAMPAIGN_FAILURE, error };
  }

  function alertMessage(error: string) {
    const alertMsg = error || 'Failed to update campaign package';

    return {
      type: SNACKBAR_ALERT,
      error: { error: alertMsg },
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  return CampaignApi.loadCampaign(campaignId)
    .then((result: any) => dispatch(success(result.data)))
    .catch((error: AxiosResponse) => {
      dispatch(failure(error));
      dispatch(alertMessage(error.response));
    });
};

export const createCampaign = (
  campaign: Campaign,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: CREATE_CAMPAIGN_REQUEST };
  }

  function success(campaigns: Campaign[]) {
    return { type: CREATE_CAMPAIGN_SUCCESS, campaigns };
  }

  function failure(error: string) {
    return { type: CREATE_CAMPAIGN_FAILURE, error };
  }
  function alertMessage(error: string) {
    const alertMsg = error || 'Failed to create campaign';

    return {
      type: SNACKBAR_ALERT,
      error: { error: alertMsg },
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  try {
    const result = await CampaignApi.createCampaign(campaign);
    dispatch(success(result.data));
    goToDashboard();
  } catch (ex) {
    dispatch(failure(ex));
    dispatch(alertMessage(ex.response));
  }
};

export const updateCampaign = (
  campaign: Campaign,
): AppThunkAction => async dispatch => {
  if (!campaign) {
    return Promise.resolve();
  }

  if (campaign.advertiserId === UNAUTH_USER_ID) {
    return dispatch(openAuthModal('signUp'));
  }

  function request() {
    return { type: UPDATE_CAMPAIGN_REQUEST };
  }

  function success(campaigns: Campaign[]) {
    return { type: UPDATE_CAMPAIGN_SUCCESS, campaigns };
  }

  function failure(error: string) {
    return { type: UPDATE_CAMPAIGN_FAILURE, error };
  }

  function alertMessage(error: string) {
    const alertMsg = error || 'Failed to update campaign package';

    return {
      type: SNACKBAR_ALERT,
      error: alertMsg,
    };
  }

  dispatch(clearAlertMessage());

  dispatch(request());

  let updatedUrls: DataType.CampaignCreativeUrlObject[] = [];
  if (campaign.creativeFiles) {
    updatedUrls = await uploadCreativeFiles(
      campaign.creativeFiles,
      campaign.advertiserId,
      campaign.id,
    );
    // eslint-disable-next-line no-param-reassign
    delete campaign.creativeFiles;
  }

  if (campaign.deletedUrls) {
    await Promise.all(
      campaign.deletedUrls.map(
        async (urlWithFormat: DataType.CampaignCreativeUrlObject) => {
          await S3Utils.removeFile(urlWithFormat.url);
        },
      ),
    );
    updatedUrls = updatedUrls.concat(campaign.deletedUrls);
    // eslint-disable-next-line no-param-reassign
    delete campaign.deletedUrls;
  }

  if (updatedUrls.length) {
    // eslint-disable-next-line no-param-reassign
    campaign.creativeUrls = xorWith(
      campaign.creativeUrls,
      updatedUrls,
      isEqual,
    );
  }

  return CampaignApi.updateCampaign(campaign)
    .then(async (result: any) => {
      await dispatch(success(result.data));
      goToDashboard();
    })
    .catch((error: AxiosResponse) => {
      dispatch(failure(error));
      dispatch(alertMessage(error.response));
    });
};

export const clearCampaignError = () => ({
  type: CLEAR_ERRORS,
});

export const reserveCampaignPackage = (
  userId: string,
  packageId: string,
  campaignData: Campaign,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: RESERVING_PACKAGE };
  }

  function success(campaign: Campaign[]) {
    return { type: RESERVING_DONE, campaign, error: null };
  }

  function failure(error: string) {
    return { type: RESERVING_DONE, campaign: null, error };
  }

  function alertMessage(error: string) {
    const alertMsg = error || 'Failed to reserve campaign package';

    return {
      type: SNACKBAR_ALERT,
      error: alertMsg,
    };
  }

  dispatch(clearAlertMessage());

  await dispatch(request());

  if (campaignData.creativeFiles && campaignData.creativeFiles.length > 0) {
    const creativeUrls = await uploadCreativeFiles(
      campaignData.creativeFiles,
      userId,
      packageId,
    );
    // eslint-disable-next-line no-param-reassign
    delete campaignData.creativeFiles;
    // eslint-disable-next-line no-param-reassign
    campaignData = { ...campaignData, creativeUrls };
  }

  try {
    const result = await CampaignApi.reservePackage({
      ...campaignData,
      packageId,
    });
    dispatch(success(result.data));
  } catch (error) {
    dispatch(failure(error));
    dispatch(alertMessage(error.response));
  }
};

export const deleteCampaign = (
  campaignId: string,
  userId: string,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: DELETE_CAMPAIGN_REQUEST };
  }

  function success() {
    return { type: DELETE_CAMPAIGN_SUCCESS, campaignId };
  }

  function failure(error: string) {
    return { type: DELETE_CAMPAIGN_FAILURE, error };
  }

  function alertMessage(error: string) {
    const alertMsg = error || 'Failed to remove campaign package';

    return {
      type: SNACKBAR_ALERT,
      error: alertMsg,
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  try {
    await CampaignApi.deleteCampaign(campaignId, userId);
    dispatch(success());
  } catch (error) {
    dispatch(failure(error));
    dispatch(alertMessage(error.response));
  }
};
