import { ICognitoUserAttributeData } from 'amazon-cognito-identity-js';
import UniqBy from 'lodash/uniqBy';
import { User, AttributeField } from '../store/users/types';
import { UserState } from '../store/user/types';
import { Client, Company } from '../store/clients/types';

export const getInitials = (name = '') =>
  name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map(v => v && v[0].toUpperCase())
    .join('');

const getFullAddress = (address: string) => {
  const jsonAddress = JSON.parse(address);
  return `${jsonAddress.streetAddress}, ${jsonAddress.city}, ${
    jsonAddress.state
  } ${jsonAddress.zipCode}`;
};

export const getFieldValue = (user: User, fieldName: string) => {
  if (user && user.Attributes && user.Attributes.length) {
    const currentField = user.Attributes.find(
      (field: ICognitoUserAttributeData) => field.Name === fieldName,
    );

    if (fieldName === 'address') {
      return currentField ? getFullAddress(currentField.Value) : '-';
    }
    if (fieldName === 'picture') {
      return currentField ? currentField.Value : '';
    }
    return currentField ? currentField.Value : '-';
  }
  return '';
};

export const updateUserAttributes = (
  user: User,
  updatedFields: AttributeField[],
) => {
  const userData = { ...user };

  if (userData.Attributes && userData.Attributes.length) {
    if (updatedFields && updatedFields.length) {
      updatedFields.forEach(updatedField => {
        const indexOfField = userData.Attributes.findIndex(
          (field: ICognitoUserAttributeData) =>
            field.Name === updatedField.Name,
        );
        if (indexOfField > -1) {
          userData.Attributes[indexOfField] = updatedField;
        } else {
          userData.Attributes.push(updatedField);
        }
      });
    }
  } else {
    userData.Attributes = updatedFields;
  }
  return userData;
};

export const userTableNameComparator = (param1: any, param2: any) => {
  const nameA = param1.firstName.toUpperCase();
  const nameB = param2.firstName.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

export const IsClient = (userState: UserState) => {
  if (userState.isUnAuth) {
    return true;
  }

  const { data } = userState;
  if (data) {
    return (
      !data.groups ||
      data.groups.includes('customers') ||
      data.groups.includes('clients')
    );
  }

  return false;
};

export const getCompanyId = (userState: UserState) => {
  const { instance } = userState;
  if (instance && instance.attributes) {
    const companyId = instance.attributes['custom:companyName'];
    if (companyId) {
      return companyId;
    }
  }

  return '';
};

export const generatePassword = (passwordLengh: number) => {
  const uppercaseList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseList = 'abcdefghijklmnopqrstuvwxyz';
  const numberList = '0123456789';

  const charset = uppercaseList + lowercaseList + numberList;
  let password = '';
  for (let i = 0, n = charset.length; i < passwordLengh; i += 1) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  const indexOfUppercase = Math.floor(Math.random() * passwordLengh);
  let indexOfNumber = indexOfUppercase;
  while (indexOfNumber === indexOfUppercase) {
    indexOfNumber = Math.floor(Math.random() * passwordLengh);
  }
  password =
    password.substring(0, indexOfUppercase) +
    uppercaseList[Math.floor(Math.random() * uppercaseList.length)] +
    password.substring(indexOfUppercase + 1);
  password =
    password.substring(0, indexOfNumber) +
    numberList[Math.floor(Math.random() * numberList.length)] +
    password.substring(indexOfNumber + 1);
  return password;
};

export const getEmailDomain = (email: string) => {
  if (email) {
    return email.substring(email.lastIndexOf('@') + 1);
  }
  return '';
};

export const getEmailDomainList = (companies: Company[]) => {
  // TODO use companySearch property for getting company email domain
  // extracted email doman from user email for now
  const emailList = companies.map(company => ({
    companyId: company.id,
    emailDomains: company.fields.associatedDomains,
  }));
  return emailList;
};

export const checkStatus = (client: Client) => {
  const { owner, fields } = client;

  if (!owner) {
    return '';
  }

  const { UserStatus } = owner;

  if (UserStatus === 'CONFIRMED') {
    return 'Active';
  }

  if (fields && !fields.invitedBy) {
    return 'Not Invited';
  }

  if (UserStatus === 'FORCE_CHANGE_PASSWORD') {
    return 'Invited';
  }
  if (UserStatus === 'UNCONFIRMED' || UserStatus === 'RESET_REQUIRED') {
    return 'Pending Verification';
  }
  return '';
};
