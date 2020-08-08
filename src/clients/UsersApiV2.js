import ApiClient from './_client';
import { apiUrls } from './urls';

const { driversUrl, sessionsUrl, usersUrl } = apiUrls;

export default class UsersApiV2 {
  static getBillingSummary(advertiserId) {
    const endpoint = `${usersUrl}/billing?userId=${advertiserId}`;
    return ApiClient.get(endpoint);
  }

  static getDriverPayoutInfo(driverId) {
    const endpoint = `${driversUrl}/payout?userId=${driverId}`;
    return ApiClient.get(endpoint);
  }

  static getRecentDriverSessions(driverId) {
    const endpoint = `${sessionsUrl}?userId=${driverId}&complete=true`;
    return ApiClient.get(endpoint);
  }
}
