import { RATE_TYPES } from './stringConsts';
import {
  BUDGET_TYPES,
  DISCOUNT_MIN_BUDGET,
  MIN_BUDGET,
  MIN_START_DATE,
} from './campaignConsts';

export const CREATE_DISABLED_USERS = [];

const HOURLY_RATE = {
  type: RATE_TYPES.HOURLY,
  hoursPerDollar: 0.25,
  impressionsPerHour: 1000,
};

const DISCOUNT_HOURLY_RATE = {
  type: RATE_TYPES.HOURLY,
  hoursPerDollar: 1 / 1.5,
  impressionsPerHour: 1000,
};

const USER_RATES = {
  stilt: DISCOUNT_HOURLY_RATE,
  truebill: DISCOUNT_HOURLY_RATE,
};

const USER_MIN_BUDGETS = {
  stilt: DISCOUNT_MIN_BUDGET,
  truebill: DISCOUNT_MIN_BUDGET,
  'dd22a11b-22f1-41cc-ac4f-7a879ac11c04': 1000.0,
};

const CAMPAIGN_MIN_START_DATES = {};

export const getBudgetRates = userId => USER_RATES[userId] || HOURLY_RATE;

export const getMinBudget = userId => USER_MIN_BUDGETS[userId] || MIN_BUDGET;

export const getMinBudgetByType = (userId, budgetType) => {
  const minMonthlyBudget = getMinBudget(userId);
  const minBudget =
    minMonthlyBudget / (budgetType === BUDGET_TYPES.DAILY ? 30 : 1);
  return Math.ceil(minBudget / 5) * 5;
};

export const getMinCampaignStartDate = userId => {
  const currentDate = new Date();
  const minDate = CAMPAIGN_MIN_START_DATES[userId] || MIN_START_DATE;
  if (minDate && currentDate < minDate) {
    // minimum date is only relevant if it is after the current date
    return minDate;
  }

  return null;
};
