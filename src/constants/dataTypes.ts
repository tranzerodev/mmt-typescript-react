import { invoices } from 'stripe';
import { ICognitoUserAttributeData } from 'amazon-cognito-identity-js';

export type StripeInvoice = invoices.IInvoice;

export interface Image {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails?: {
    small: {
      url: string;
      width: number;
      height: number;
    };
    large: {
      url: string;
      width: number;
      height: number;
    };
    full: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CampaignPerformanceModule {
  id: string;
  selected?: boolean;
  data?: any;
}

export interface CampaignCreativeUrlObject {
  format: string;
  url: string;
}

export interface CampaignCreativeFileObject {
  file: File;
  format: string;
}

export interface DmaModel {
  id: string;
  name: string;
  disabled: boolean;
}

export interface CampaignOptionsType {
  formats: object[];
  dmas: DmaModel[];
  types: EndpointScreenType[];
}

export interface EndpointScreenType {
  id: string;
  Name: string;
  'Endpoint Category'?: string[];
  autoWidth?: boolean;
  resolutionHeight: number;
  resolutionWidth: number;
}

export interface EndpointModel {
  EndpointId: string;
  GroupSize: number;
  Latitude: number;
  Longitude: number;
}

export interface MarkerModel {
  id: string;
  lat: number;
  lng: number;
  count?: number;
}

export interface MovingEndpoint {
  treePath: string[];
  hourlyImpressions: number;
  month_1: number;
  month_2: number;
  month_3: number;
  month_4: number;
  month_5: number;
}
export interface UserClientModel {
  endpoint: string;
  userAgent: string;
}

export interface CognitoUserPool {
  userPoolId: string;
  clientId: string;
  client: UserClientModel;
  advancedSecurityDataCollectionFlag: boolean;
  storage: any;
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
export interface User {
  Attributes: ICognitoUserAttributeData[];
  Enabled: boolean;
  MFAOptions: string;
  UserCreateDate: string;
  UserLastModifiedDate: string;
  UserStatus: string;
  Username: string;
}

export interface BaseEntity {
  id: string;
  ownerId: string;
  identityId: string;
  owner?: User;
  createdDate: string;
  udpatedDate: string;
}
