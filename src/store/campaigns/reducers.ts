import PropTypes from 'prop-types';
import unionBy from 'lodash/unionBy';

import {
  CampaignsState,
  CampaignsActionTypes,
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
  CLEAR_CAMPAIGNS,
  DELETE_CAMPAIGN_REQUEST,
  DELETE_CAMPAIGN_SUCCESS,
  DELETE_CAMPAIGN_FAILURE,
  CLEAR_RESERVED_CAMPAIGN,
} from './types';

const initialState: CampaignsState = {
  isLoading: false,
  data: [],
  error: '',
  options: [],
  optionsError: '',
  updating: false,
  updatingError: '',
  reservingPackage: false,
  reservedCampaign: null,
  reservingExperienceError: '',
  isListLoaded: false,
};

export const campaignPropType = PropTypes.shape({
  campaignName: PropTypes.string,
  displayName: PropTypes.string,
  campaignObjective: PropTypes.string,
  isActive: PropTypes.bool,
  budgetType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  endDate: PropTypes.string,
  startDate: PropTypes.string,
  audienceId: PropTypes.string,
});

export const CampaignOptionsType = PropTypes.shape({
  formats: PropTypes.arrayOf(PropTypes.object),
  dmas: PropTypes.arrayOf(PropTypes.object),
});

const campaignsReducer = (
  state = initialState,
  action: CampaignsActionTypes,
) => {
  switch (action.type) {
    case CLEAR_CAMPAIGNS:
      return {
        ...state,
        isListLoaded: false,
        data: [],
      };
    case CLEAR_RESERVED_CAMPAIGN:
      return {
        ...state,
        reservedCampaign: null,
        reservingPackage: false,
      };
    case LOAD_CAMPAIGNS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case LOAD_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isListLoaded: true,
        data: action.campaigns || [],
        error: null,
      };

    case LOAD_CAMPAIGNS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isListLoaded: false,
        error: action.error,
      };

    case LOAD_CAMPAIGN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case LOAD_CAMPAIGN_SUCCESS: {
      const campaignList = unionBy(action.campaign, state.data, 'id');
      return {
        ...state,
        isLoading: false,
        data: campaignList || [],
        error: null,
      };
    }

    case LOAD_CAMPAIGN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    case CREATE_CAMPAIGN_REQUEST:
      return {
        ...state,
        updating: true, // we can use updating flag, don't need to create new flag.
        updatingError: null,
      };

    case CREATE_CAMPAIGN_SUCCESS: {
      const newCampain = action.campaigns;
      const updatedData = state.data.concat(newCampain);
      return {
        ...state,
        data: updatedData,
        updating: false,
        updatingError: null,
      };
    }

    case CREATE_CAMPAIGN_FAILURE: {
      return {
        ...state,
        updating: false,
        updatingError: action.error,
      };
    }

    case UPDATE_CAMPAIGN_REQUEST:
      return {
        ...state,
        updating: true,
        updatingError: null,
      };

    case UPDATE_CAMPAIGN_SUCCESS: {
      const campaignList = unionBy(action.campaigns, state.data, 'id');
      return {
        ...state,
        updating: false,
        updatingError: null,
        data: campaignList,
      };
    }

    case UPDATE_CAMPAIGN_FAILURE:
      return {
        ...state,
        updating: false,
        updatingError: action.error,
      };

    case RESERVING_PACKAGE:
      return {
        ...state,
        reservingPackage: true,
        reservedCampaign: null,
        reservingExperienceError: null,
      };

    case RESERVING_DONE: {
      const { campaign, error } = action;
      const data = campaign ? state.data.concat(campaign) : state.data;
      return {
        ...state,
        data,
        reservingPackage: false,
        reservedCampaign: campaign && campaign.length ? campaign[0] : null,
        reservingExperienceError: error,
      };
    }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        updatingError: null,
      };

    case DELETE_CAMPAIGN_REQUEST:
      return {
        ...state,
        updating: true,
        updatingError: null,
      };

    case DELETE_CAMPAIGN_SUCCESS: {
      const { campaignId } = action;
      const updatedData = state.data.filter(item => item.id !== campaignId);
      return {
        ...state,
        data: updatedData,
        updating: false,
        updatingError: null,
      };
    }

    case DELETE_CAMPAIGN_FAILURE: {
      return {
        ...state,
        updating: false,
        updatingError: action.error,
      };
    }

    default:
      return state;
  }
};

export default campaignsReducer;
