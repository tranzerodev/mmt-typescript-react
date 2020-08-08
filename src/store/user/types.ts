import { CognitoUser as AmazonCognitoUser } from 'amazon-cognito-identity-js';

export const CLEAR_USER = 'CLEAR_USER';
export const UPDATE_USER_ID = 'UPDATE_USER_ID';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATED_USER_ATTRIBUTE = 'UPDATED_USER_ATTRIBUTE';
export const UPDATING_USER_ATTRIBUTE = 'UPDATING_USER_ATTRIBUTE';
export const UPDATING_USER_PAYMENT = 'UPDATING_USER_PAYMENT';
export const UPDATED_USER_PAYMENT = 'UPDATED_USER_PAYMENT';
export const USER_LOADED = 'USER_LOADED';
export const UPDATE_VIEW_MODE = 'UDPATE_VIEW_MODE';

export interface CognitoUser extends AmazonCognitoUser {
  attributes: Record<string, string>;
}

export interface UserData {
  groups?: string;
}

export interface UserState {
  isUnAuth: boolean;
  updatingAttributes: boolean;
  updatingPayment: boolean;
  loaded: boolean;
  data: UserData | null;
  instance: CognitoUser | null;
  viewMode: string;
  id: string;
}

export interface PaymentAttributes {
  'custom:stripeUserId': string;
}

export interface UserAttributes {
  sub?: string;
  email_verified?: string;
  phone_number_verified?: string;
  phone_number?: string;
  email?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  zoneinfo?: string;
  address?: string;
}

interface UpdateUserAction {
  type: typeof UPDATE_USER;
  user: CognitoUser;
  userId: string;
  data: UserData;
}

interface UpdateViewModeAction {
  type: typeof UPDATE_VIEW_MODE;
  mode: string;
}

interface UserUserIdAction {
  type: typeof UPDATE_USER_ID;
  id: string;
}

interface ClearUser {
  type: typeof CLEAR_USER;
}

interface UpdateUserAttributesAction {
  type: typeof UPDATED_USER_ATTRIBUTE;
  attributes: Record<string, string>;
}

interface UpdatingUserAttributesAction {
  type: typeof UPDATING_USER_ATTRIBUTE;
}

interface UpdatingUserPaymentAction {
  type: typeof UPDATING_USER_PAYMENT;
}

interface UserLoadedAction {
  type: typeof USER_LOADED;
  loaded: boolean;
}

interface UpdatedUserPaymentAction {
  type: typeof UPDATED_USER_PAYMENT;
  paymentAttributes: PaymentAttributes;
  error: Error;
}

export type UserActionTypes =
  | UpdateUserAction
  | UpdateViewModeAction
  | UserUserIdAction
  | UpdateUserAttributesAction
  | ClearUser
  | UpdatingUserAttributesAction
  | UpdatingUserPaymentAction
  | UpdatedUserPaymentAction
  | UserLoadedAction;
