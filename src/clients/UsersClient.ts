import { API } from 'aws-amplify';
import Axios, { AxiosResponse } from 'axios';
import { Address } from '@stripe/stripe-js';

import { StripeInvoice } from '../constants/dataTypes';
import { Campaign } from '../store/campaigns/types';
import { Client, ClientFormData } from '../store/clients/types';
import { PaymentInfo } from '../store/settings/types';

interface CardData {
  userId: string;
  email: string;
  token: string;
}

interface StripeTokenResponse {
  customerId: string;
}

interface LoadUserDataResponse {
  data: {
    groups?: string;
    clients: Client[];
    campaigns: Campaign[];
  };
}

interface GetSettingsResponse {
  paymentInfo?: PaymentInfo;
  invoices: StripeInvoice[];
}

export default class UsersClient {
  static setUserSession(accessToken: string) {
    return Axios({
      method: 'post',
      url: '/api/profile/session',
      data: { accessToken },
    });
  }

  static createCardToken(
    cardData: CardData,
  ): Promise<AxiosResponse<StripeTokenResponse>> {
    const url = '/api/stripe/cardToken';
    return Axios({
      method: 'post',
      url,
      data: cardData,
    });
  }

  static GetStripeOauthUrl(
    companyInformation: any,
  ): Promise<AxiosResponse<string>> {
    const url = `/api/stripe/oauthUrl`;
    return Axios({
      method: 'get',
      url,
      params: {
        next: window.location.href,
        ...companyInformation,
      },
    });
  }

  static SavePaymentInfo(
    userId: string,
    id: string,
    customerId: string,
    address: Address,
  ): Promise<PaymentInfo> {
    return API.put('LightoutApi', `/users/${userId}/payment`, {
      body: {
        id,
        customerId,
        address,
      },
    });
  }

  static loadUser(userId: string): Promise<LoadUserDataResponse> {
    return API.get('LightoutApi', `/users/${userId}`, {});
  }

  static listUsers() {
    return API.get('LightoutApi', `/users`, {});
  }

  static GetSettings(userId: string): Promise<GetSettingsResponse> {
    return API.get('LightoutApi', `/users/${userId}/settings`, {});
  }

  static deleteUser(userId: string) {
    return API.del('LightoutApi', `/users/${userId}`, {});
  }

  static updateClientUser(clientData: ClientFormData) {
    const {
      userId,
      cognitoEmail,
      cognitoFirstName,
      cognitoLastName,
      companyName,
      companyId,
    } = clientData;

    const clientUser = {
      /* eslint-disable @typescript-eslint/camelcase */
      given_name: cognitoFirstName,
      /* eslint-disable @typescript-eslint/camelcase */
      family_name: cognitoLastName,
      email: cognitoEmail,
      companyName,
    };

    if (companyId) {
      delete clientUser.companyName;
    }

    return API.put('LightoutApi', `/vx/clients/user`, {
      body: {
        data: [
          {
            id: userId,
            fields: {
              companyId,
            },
            additionalFields: clientUser,
          },
        ],
      },
    });
  }
}
