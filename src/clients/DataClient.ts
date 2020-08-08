import { API } from 'aws-amplify';

export default class DataClient {
  static getResources() {
    return API.get('LightoutApi', '/data/resources', {});
  }
}
