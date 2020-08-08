import { API } from 'aws-amplify';
import {
  EndpointParam,
  EndpointParamKey,
  EndpointFormValueType,
} from '../store/endpoints/types';

const baseGetEndpointsParams = { networkId: '' };

export default class EndpointsClient {
  static getEndpointsByUser(userId: string) {
    return API.get('LightoutApi', '/endpoints', {
      queryStringParameters: {
        ...baseGetEndpointsParams,
        userId,
      },
    });
  }

  static getEndpoints(params: EndpointParam) {
    const filteredParams = params;
    Object.keys(filteredParams).forEach(key => {
      if (!filteredParams[key as EndpointParamKey].length)
        delete filteredParams[key as EndpointParamKey];
    });
    return API.get('LightoutApi', '/endpoints', {
      queryStringParameters: {
        ignorePortal: true,
        ...baseGetEndpointsParams,
        ...filteredParams,
      },
    });
  }

  static getMovingEndpointsByUser(userId: string) {
    return API.get('LightoutApi', '/moving-endpoints', {
      queryStringParameters: {
        ...baseGetEndpointsParams,
        userId,
      },
    });
  }

  static createEndpoint(endPointsData: EndpointFormValueType) {
    return API.post('LightoutApi', '/endpoints/batch', {
      body: endPointsData,
    });
  }

  static getEndpointsByPackage(packageId: string) {
    return API.get('LightoutApi', `/packages/${packageId}/endpoints`, {
      queryStringParameters: {
        ...baseGetEndpointsParams,
      },
    });
  }
}
