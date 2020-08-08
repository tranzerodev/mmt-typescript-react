import { BaseEntity, User } from '../../constants/dataTypes';

export interface Company extends BaseEntity {
  fields: {
    name: string;
    primaryDomain: string;
    associatedDomains: string[];
  };
}

export interface Client extends BaseEntity {
  fields: {
    companyId?: string;
    invitedBy?: string;
  };
}

export interface CompanyFormData {
  companyId?: string;
  companyName: string;
}

export interface ClientFormData extends CompanyFormData {
  userId?: string;
  cognitoEmail: string;
  cognitoFirstName: string;
  cognitoLastName: string;
}

export interface ProfileFieldModal {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  email: string;
}

export interface ClientTableRowModal {
  userId: string;
  name: ProfileFieldModal;
  userName: string;
  clientFullData?: Client;
  company: string;
  role: string;
  creationDate: string;
  location: string;
  status: string;
}

export interface CompanyTableRowModal {
  companyId: string;
  company: string;
  registeredDate: string;
}

export interface ClientsStoreChangeModel {
  isCreating: boolean;
  isUpdating: boolean;
  createdClient: boolean;
  updatedClient: boolean;
  error: string;
  clients: Client[];
  companies: Company[];
}

export interface ClientsState {
  clients: Client[];
  companies: Company[];
  isLoading: boolean;
  loadedClients: boolean;
  isInviting: boolean;
  invitedClient: boolean;
  isCreating: boolean;
  createdClient: boolean;
  isCompanyCreating: boolean;
  isCompanyCreated: boolean;
  isRemoving: boolean;
  isUpdating: boolean;
  updatedClient: boolean;
  error: string;
}

export const LOAD_CLIENTS_REQUEST = 'LOADING_CLIENTS';
export const LOAD_CLIENTS_SUCCESS = 'LOAD_CLIENTS_SUCCESS';
export const LOAD_CLIENTS_FAILURE = 'LOAD_CLIENTS_FAILURE';
export const LOAD_COMPANIES_REQUEST = 'LOADING_COMPANIES';
export const LOAD_COMPANIES_SUCCESS = 'LOAD_COMPANIES_SUCCESS';
export const LOAD_COMPANIES_FAILURE = 'LOAD_COMPANIES_FAILURE';
export const ADD_CLIENT_REQUEST = 'LOADING_CLIENT';
export const ADD_CLIENT_SUCCESS = 'ADD_CLIENT_SUCCESS';
export const ADD_CLIENT_FAILURE = 'LOAD_CLIENT_FAILURE';
export const INVITE_CLIENT_REQUEST = 'INVITING_CLIENT';
export const INVITE_CLIENT_SUCCESS = 'INVITE_CLIENT_SUCCESS';
export const INVITE_CLIENT_FAILURE = 'INVITE_CLIENT_FAILURE';
export const UPDATE_CLIENT_REQUEST = 'UPDATE_CLIENT_REQUEST';
export const UPDATE_CLIENT_SUCCESS = 'UPDATE_CLIENT_SUCCESS';
export const UPDATE_CLIENT_FAILURE = 'UPDATE_CLIENT_FAILURE';
export const CLEAR_CLIENTS = 'CLEAR_CLIENTS';
export const DELETE_CLIENTS_REQUEST = 'DELETE_CLIENTS_REQUEST';
export const DELETE_CLIENTS_SUCCESS = 'DELETE_CLIENTS_SUCCESS';
export const DELETE_CLIENTS_FAILED = 'DELETE_CLIENTS_FAILED';
export const ADD_COMPANY_REQUEST = 'ADDING_COMPANY';
export const ADD_COMPANY_SUCCESS = 'ADD_COMPANY_SUCCESS';
export const ADD_COMPANY_FAILURE = 'ADD_COMPANY_FAILURE';
export const UPDATE_COMPANY_REQUEST = 'UPDATE_COMPANY_REQUEST';
export const UPDATE_COMPANY_SUCCESS = 'UPDATE_COMPANY_SUCCESS';
export const UPDATE_COMPANY_FAILURE = 'UPDATE_COMPANY_FAILURE';
export const DELETE_COMPANY_REQUEST = 'DELETE_COMPANY_REQUEST';
export const DELETE_COMPANY_SUCCESS = 'DELETE_COMPANY_SUCCESS';
export const DELETE_COMPANY_FAILED = 'DELETE_COMPANY_FAILED';

interface ClearClientsAction {
  type: typeof CLEAR_CLIENTS;
}

interface StartLoadClientsAction {
  type: typeof LOAD_CLIENTS_REQUEST;
}

interface LoadClientsDoneAction {
  type: typeof LOAD_CLIENTS_SUCCESS;
  payload: Client;
}

interface LoadClientsFailAction {
  type: typeof LOAD_CLIENTS_FAILURE;
  error: string;
}

interface StartLoadCompaniesAction {
  type: typeof LOAD_COMPANIES_REQUEST;
}

interface LoadCompaniesDoneAction {
  type: typeof LOAD_COMPANIES_SUCCESS;
  payload: Company[];
}

interface LoadCompaniesFailAction {
  type: typeof LOAD_COMPANIES_FAILURE;
  error: string;
}

interface StartAddClientAction {
  type: typeof ADD_CLIENT_REQUEST;
}

interface AddClientDoneAction {
  type: typeof ADD_CLIENT_SUCCESS;
  payload: any;
}

interface AddClientFailAction {
  type: typeof ADD_CLIENT_FAILURE;
  error: string;
}

interface StartInviteClientAction {
  type: typeof INVITE_CLIENT_REQUEST;
}

interface InviteClientDoneAction {
  type: typeof INVITE_CLIENT_SUCCESS;
  userId: string;
  inviteUserId: string;
}

interface InviteClientFailAction {
  type: typeof INVITE_CLIENT_FAILURE;
  error: string;
}

interface StartUpdateClientAction {
  type: typeof UPDATE_CLIENT_REQUEST;
}

interface UpdateClientDoneAction {
  type: typeof UPDATE_CLIENT_SUCCESS;
  payload: any;
}

interface UpdateClientFailAction {
  type: typeof UPDATE_CLIENT_FAILURE;
  error: string;
}

interface StartDeleteClientAction {
  type: typeof DELETE_CLIENTS_REQUEST;
}

interface DeleteClientDoneAction {
  type: typeof DELETE_CLIENTS_SUCCESS;
  payload: string;
}

interface DeleteClientFailAction {
  type: typeof DELETE_CLIENTS_FAILED;
  error: string;
}

interface StartAddCompanyAction {
  type: typeof ADD_COMPANY_REQUEST;
}

interface AddCompanyDoneAction {
  type: typeof ADD_COMPANY_SUCCESS;
  payload: any;
}

interface AddCompanyFailAction {
  type: typeof ADD_COMPANY_FAILURE;
  error: string;
}

interface StartUpdateCompanyAction {
  type: typeof UPDATE_COMPANY_REQUEST;
}

interface UpdateCompanyDoneAction {
  type: typeof UPDATE_COMPANY_SUCCESS;
  payload: any;
}

interface UpdateCompanyFailAction {
  type: typeof UPDATE_COMPANY_FAILURE;
  error: string;
}

interface StartDeleteCompanyAction {
  type: typeof DELETE_COMPANY_REQUEST;
}

interface DeleteCompanyDoneAction {
  type: typeof DELETE_COMPANY_SUCCESS;
  payload: string;
}

interface DeleteCompanyFailAction {
  type: typeof DELETE_COMPANY_FAILED;
  error: string;
}

export type ClientsActionTypes =
  | ClearClientsAction
  | StartLoadClientsAction
  | LoadClientsDoneAction
  | LoadClientsFailAction
  | StartLoadCompaniesAction
  | LoadCompaniesDoneAction
  | LoadCompaniesFailAction
  | StartAddClientAction
  | AddClientDoneAction
  | AddClientFailAction
  | StartInviteClientAction
  | InviteClientDoneAction
  | InviteClientFailAction
  | StartDeleteClientAction
  | DeleteClientDoneAction
  | DeleteClientFailAction
  | StartDeleteCompanyAction
  | DeleteCompanyDoneAction
  | DeleteCompanyFailAction
  | StartAddCompanyAction
  | AddCompanyDoneAction
  | AddCompanyFailAction
  | StartUpdateClientAction
  | UpdateClientDoneAction
  | UpdateClientFailAction
  | StartUpdateCompanyAction
  | UpdateCompanyDoneAction
  | UpdateCompanyFailAction;
