import { API } from 'aws-amplify';

export default class CampaignApi {
  static listCampaigns() {
    return API.get('LightoutApi', `/campaigns`);
  }

  static createCampaign(campaignData) {
    return API.post('LightoutApi', `/campaigns`, {
      body: {
        ...campaignData,
        startDate: new Date(campaignData.startDate).toISOString(),
        endDate: new Date(campaignData.endDate).toISOString(),
      },
    });
  }

  static updateCampaign(campaignData) {
    return API.put('LightoutApi', '/campaigns', {
      body: {
        ...campaignData,
        startDate: new Date(campaignData.startDate).toISOString(),
        endDate: new Date(campaignData.endDate).toISOString(),
      },
    });
  }

  static reservePackage(campaignData) {
    return API.post('LightoutApi', '/campaigns', {
      body: campaignData,
    });
  }

  static loadCampaign(campaignId) {
    return API.get('LightoutApi', `/campaigns/${campaignId}`, {});
  }

  static deleteCampaign(campaignId, userId) {
    return API.del('LightoutApi', `/campaigns/${campaignId}`, { userId });
  }
}
