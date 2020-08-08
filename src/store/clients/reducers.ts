import {
  ClientsState,
  ClientsActionTypes,
  LOAD_CLIENTS_REQUEST,
  LOAD_CLIENTS_SUCCESS,
  LOAD_CLIENTS_FAILURE,
  LOAD_COMPANIES_REQUEST,
  LOAD_COMPANIES_SUCCESS,
  LOAD_COMPANIES_FAILURE,
  ADD_CLIENT_REQUEST,
  ADD_CLIENT_SUCCESS,
  ADD_CLIENT_FAILURE,
  UPDATE_CLIENT_REQUEST,
  UPDATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_FAILURE,
  INVITE_CLIENT_REQUEST,
  INVITE_CLIENT_SUCCESS,
  INVITE_CLIENT_FAILURE,
  DELETE_CLIENTS_REQUEST,
  DELETE_CLIENTS_SUCCESS,
  DELETE_CLIENTS_FAILED,
  UPDATE_COMPANY_REQUEST,
  UPDATE_COMPANY_SUCCESS,
  UPDATE_COMPANY_FAILURE,
  DELETE_COMPANY_REQUEST,
  DELETE_COMPANY_SUCCESS,
  DELETE_COMPANY_FAILED,
  CLEAR_CLIENTS,
  ADD_COMPANY_REQUEST,
  ADD_COMPANY_SUCCESS,
  ADD_COMPANY_FAILURE,
} from './types';

import { updateUserAttributes } from '../../utils/UserUtils';

const initialState: ClientsState = {
  clients: [],
  companies: [],
  isLoading: false,
  loadedClients: false,
  isCreating: false,
  createdClient: false,
  isCompanyCreated: false,
  isCompanyCreating: false,
  isRemoving: false,
  isUpdating: false,
  updatedClient: false,
  isInviting: false,
  invitedClient: false,
  error: '',
};

const clientsReducer = (state = initialState, action: ClientsActionTypes) => {
  switch (action.type) {
    case CLEAR_CLIENTS: {
      return initialState;
    }
    case LOAD_CLIENTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case LOAD_CLIENTS_SUCCESS: {
      const clients = action.payload;
      return {
        ...state,
        isLoading: false,
        loadedClients: true,
        clients,
        error: '',
      };
    }
    case LOAD_CLIENTS_FAILURE: {
      const { error } = action;
      return {
        ...state,
        isLoading: false,
        loadedClients: false,
        error,
      };
    }
    case LOAD_COMPANIES_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case LOAD_COMPANIES_SUCCESS: {
      const companies = action.payload;
      return {
        ...state,
        isLoading: false,
        loadedClients: true,
        companies,
        error: '',
      };
    }
    case LOAD_COMPANIES_FAILURE: {
      const { error } = action;
      return {
        ...state,
        isLoading: false,
        loadedClients: false,
        error,
      };
    }
    case ADD_CLIENT_REQUEST:
      return {
        ...state,
        isCreating: true,
        createdClient: false,
        error: '',
      };
    case ADD_CLIENT_SUCCESS: {
      const newClient = action.payload;
      return {
        ...state,
        isCreating: false,
        createdClient: true,
        clients: state.clients.concat(newClient),
        error: '',
      };
    }
    case ADD_CLIENT_FAILURE: {
      const { error } = action;
      return {
        ...state,
        isCreating: false,
        createdClient: false,
        error,
      };
    }
    case DELETE_CLIENTS_REQUEST:
      return {
        ...state,
        isRemoving: true,
        error: null,
      };

    case DELETE_CLIENTS_SUCCESS: {
      const { payload } = action;
      const updatedData = state.clients.filter(
        client => client.cognitoUserId !== payload,
      );
      return {
        ...state,
        clients: updatedData,
        isRemoving: false,
        error: null,
      };
    }

    case DELETE_CLIENTS_FAILED: {
      return {
        ...state,
        isRemoving: false,
        error: action.error,
      };
    }
    case DELETE_COMPANY_REQUEST:
      return {
        ...state,
        isRemoving: true,
        error: null,
      };

    case DELETE_COMPANY_SUCCESS: {
      const { payload } = action;
      const updatedData = state.clients.filter(
        client => client.companyId !== payload,
      );
      return {
        ...state,
        clients: updatedData,
        isRemoving: false,
        error: null,
      };
    }

    case DELETE_COMPANY_FAILED: {
      return {
        ...state,
        isRemoving: false,
        error: action.error,
      };
    }

    case ADD_COMPANY_REQUEST:
      return {
        ...state,
        isCompanyCreating: true,
        isCompanyCreated: false,
        error: '',
      };
    case ADD_COMPANY_SUCCESS: {
      const newCompany = action.payload;
      return {
        ...state,
        isCompanyCreating: false,
        isCompanyCreated: true,
        companies: state.companies.concat(newCompany),
        error: '',
      };
    }
    case ADD_COMPANY_FAILURE: {
      const { error } = action;
      return {
        ...state,
        isCompanyCreating: false,
        isCompanyCreated: false,
        error,
      };
    }

    case UPDATE_CLIENT_REQUEST:
      return {
        ...state,
        isUpdating: true,
        updatedClient: false,
        error: null,
      };

    case UPDATE_CLIENT_SUCCESS: {
      const { payload } = action;

      let updatedClient = state.clients.find(
        client => client.id === payload.userId,
      );

      if (updatedClient) {
        const updatedFields = [
          {
            Name: 'given_name',
            Value: payload.cognitoFirstName,
          },
          {
            Name: 'family_name',
            Value: payload.cognitoLastName,
          },
          {
            Name: 'email',
            Value: payload.cognitoEmail,
          },
          {
            Name: 'custom:companyName',
            Value: payload.companyId,
          },
        ];
        updatedClient = {
          ...updatedClient,
          fields: {
            ...updatedClient.fields,
            companyId: payload.companyId,
          },
          owner: updateUserAttributes(updatedClient.owner, updatedFields),
        };
      }

      let updatedData = state.clients.filter(
        client => client.id !== payload.userId,
      );
      if (updatedClient) {
        updatedData = updatedData.concat([updatedClient]);
      }

      return {
        ...state,
        clients: updatedData,
        isUpdating: false,
        updatedClient: true,
        error: null,
      };
    }

    case UPDATE_CLIENT_FAILURE: {
      return {
        ...state,
        isUpdating: false,
        updatedClient: false,
        error: action.error,
      };
    }

    case INVITE_CLIENT_REQUEST:
      return {
        ...state,
        isInviting: true,
        invitedClient: false,
        error: null,
      };

    case INVITE_CLIENT_SUCCESS: {
      const { userId, inviteUserId } = action;

      let updatedClient = state.clients.find(client => client.id === userId);

      if (updatedClient) {
        const { owner, fields } = updatedClient;
        if (owner) {
          updatedClient = {
            ...updatedClient,
            fields: {
              ...fields,
              invitedBy: inviteUserId,
            },
            owner: {
              ...owner,
              UserStatus: 'FORCE_CHANGE_PASSWORD',
            },
          };
        }
      }

      let updatedData = state.clients.filter(client => client.id !== userId);
      if (updatedClient) {
        updatedData = updatedData.concat([updatedClient]);
      }

      return {
        ...state,
        clients: updatedData,
        isUpdating: false,
        updatedClient: true,
        error: null,
      };
    }

    case INVITE_CLIENT_FAILURE: {
      return {
        ...state,
        isInviting: false,
        invitedClient: false,
        error: action.error,
      };
    }

    case UPDATE_COMPANY_REQUEST:
      return {
        ...state,
        isUpdating: true,
        updatedClient: false,
        error: null,
      };

    case UPDATE_COMPANY_SUCCESS: {
      const { payload } = action;

      let updatedClient = state.clients.filter(
        client => client.companyId === payload.companyId,
      );

      let updatedData = state.clients.filter(
        client => client.companyId !== payload.companyId,
      );

      if (updatedClient && updatedClient.length) {
        updatedClient = updatedClient.map(client => ({
          ...client,
          companyName: payload.companyName,
        }));
        updatedData = updatedData.concat(updatedClient);
      }

      return {
        ...state,
        clients: updatedData,
        isUpdating: false,
        updatedClient: true,
        error: null,
      };
    }

    case UPDATE_COMPANY_FAILURE: {
      return {
        ...state,
        isUpdating: false,
        updatedClient: false,
        error: action.error,
      };
    }
    default:
      return state;
  }
};

export default clientsReducer;
