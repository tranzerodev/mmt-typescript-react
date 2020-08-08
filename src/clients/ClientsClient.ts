import { API } from 'aws-amplify';
import { ClientFormData, CompanyFormData, Company } from '../store/clients/types';

export default class ClientsClient {
  static listAllClients() {
    return Promise.all([
      API.get('LightoutApi', `/vx/clients/company`, {}),
      API.get('LightoutApi', `/vx/clients/user`, {}),
    ]);
  }

  static listClients() {
    return API.get('LightoutApi', `/vx/clients/user`, {});
  }

  static listCompanyClients(companyId: string) {
    return API.get('LightoutApi', `/clients/${companyId}`, {});
  }

  static newClientSignUp(userId: string) {
    return API.post('LightoutApi', `/vx/clients/user/${userId}`, {});
  }

  static addClient(clientData: ClientFormData) {
    const {
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

    return API.post('LightoutApi', `/vx/clients/user`, {
      body: {
        data: [
          {
            fields: {
              companyId,
            },
            additionalFields: clientUser,
          },
        ],
      },
    });
  }

  static inviteClient(userId: string) {
    return API.post('LightoutApi', `/vx/clients/user/${userId}/invite`, {
      body: {},
    });
  }

  static createCompany(clientData: ClientFormData) {
    const { companyName } = clientData;
    return API.post('LightoutApi', `/vx/clients/company`, {
      body: {
        data: [
          {
            fields: {
              name: companyName,
            },
          },
        ],
      },
    });
  }

  static deleteCompany(company: Company) {
    return API.del('LightoutApi', `/vx/clients/company`, {
      body: {
        data: [
          {
            id: company.id,
            ownerId: company.ownerId
          },
        ],
      },
    });
  }

  static updateCompany(clientData: CompanyFormData) {
    return API.put('LightoutApi', `/clients`, {
      body: clientData,
    });
  }
}
