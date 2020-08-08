import { API } from 'aws-amplify';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import { Package } from '../store/packages/types';

interface PackageDetailsData {
  item: Package;
}

const dateValueFormat = 'YYYY-MM-DD';

export default class PackagesClient {
  static getPackages() {
    return API.get('LightoutApi', `/packages`, {
      queryStringParameters: {
        version: 2,
      },
    });
  }

  static createPackage(newPackage: Package) {
    const packageItem = {
      ...newPackage,
      startDate: moment(newPackage.startDate).format(dateValueFormat),
      endDate: moment(newPackage.endDate).format(dateValueFormat),
    };
    delete packageItem.ownerId;
    return API.post('LightoutApi', '/packages', {
      body: packageItem,
    });
  }

  static updatePackage(updatedPackage: Package) {
    const packageItem = {
      ...updatedPackage,
      startDate: moment(updatedPackage.startDate).format(dateValueFormat),
      endDate: moment(updatedPackage.endDate).format(dateValueFormat),
    };
    delete packageItem['Lookup:Categories'];
    return API.put('LightoutApi', '/packages', {
      body: packageItem,
    });
  }

  static getPackageDetails(
    id: string,
  ): Promise<AxiosResponse<PackageDetailsData>> {
    return API.get('LightoutApi', `/packages/${id}`, {
      queryStringParameters: {
        version: 2,
      },
    });
  }

  static deletePackage(packageId: string, userId: string) {
    return API.del('LightoutApi', `/packages/${packageId}`, { userId });
  }
}
