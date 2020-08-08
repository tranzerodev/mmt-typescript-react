import { API } from 'aws-amplify';
import ApiClient from './_client';

export default class UsersApi {
  static getUserData(userId) {
    return API.get('LightoutApi', `/users/${userId}`, {});
  }

  static setUserSession(accessToken) {
    const endpoint = '/api/profile/session';
    return ApiClient.post(endpoint, { accessToken });
  }
}
