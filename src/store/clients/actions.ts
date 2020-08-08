import { AxiosResponse } from 'axios';
import ClientsClient from '../../clients/ClientsClient';
import { clearAlertMessage, alertSnackbar } from '../ui/actions';
import { AppThunkAction } from '../reduxTypes';
import {
  Client,
  Company,
  LOAD_CLIENTS_REQUEST,
  LOAD_CLIENTS_SUCCESS,
  LOAD_CLIENTS_FAILURE,
  LOAD_COMPANIES_SUCCESS,
  ADD_CLIENT_REQUEST,
  ADD_CLIENT_SUCCESS,
  ADD_CLIENT_FAILURE,
  ADD_COMPANY_REQUEST,
  INVITE_CLIENT_REQUEST,
  INVITE_CLIENT_SUCCESS,
  INVITE_CLIENT_FAILURE,
  UPDATE_CLIENT_REQUEST,
  UPDATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_FAILURE,
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
  ClientFormData,
  CompanyFormData,
  ADD_COMPANY_SUCCESS,
  ADD_COMPANY_FAILURE,
} from './types';
import { SNACKBAR_ALERT, SUCCESS } from '../ui/types';
import UsersClient from '../../clients/UsersClient';

export const setClientsAction = (clients: Client[]) => ({
  type: LOAD_CLIENTS_SUCCESS,
  payload: clients,
});

export const setCompaniesAction = (companies: Company[]) => ({
  type: LOAD_COMPANIES_SUCCESS,
  payload: companies,
});

export const listClients = (): AppThunkAction => dispatch => {
  function request() {
    return { type: LOAD_CLIENTS_REQUEST };
  }

  function failure(error: string) {
    return { type: LOAD_CLIENTS_FAILURE, error };
  }

  function alertMessage(error: AxiosResponse) {
    let alertMsg = '';
    if (error) {
      const { data, status } = error;
      const { message } = data;
      if (message) {
        return { type: SNACKBAR_ALERT, error };
      }
      alertMsg =
        status === 403
          ? 'You are not allowed to load clients'
          : 'Sorry, there was a problem to load clients';
    } else {
      alertMsg = 'Failed to load clients';
    }

    return {
      type: SNACKBAR_ALERT,
      error: { ...error, data: { message: alertMsg } },
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  return ClientsClient.listAllClients()
    .then((result: any) => {
      dispatch(setCompaniesAction(result[0]));
      dispatch(setClientsAction(result[1]));
    })
    .catch((error: any) => {
      dispatch(alertMessage(error.response));
      dispatch(failure(error));
    });
};

export const listCompanyClients = (
  companyId: string,
): AppThunkAction => dispatch => {
  function request() {
    return { type: LOAD_CLIENTS_REQUEST };
  }

  function success(payload: any) {
    return { type: LOAD_CLIENTS_SUCCESS, payload };
  }

  function failure(error: string) {
    return { type: LOAD_CLIENTS_FAILURE, error };
  }

  function alertMessage(error: AxiosResponse) {
    let alertMsg = '';
    if (error) {
      const { data, status } = error;
      const { message } = data;
      if (message) {
        return { type: SNACKBAR_ALERT, error };
      }
      alertMsg =
        status === 403
          ? 'You are not allowed to load clients'
          : 'Sorry, there was a problem to load clients';
    } else {
      alertMsg = 'Failed to load clients';
    }

    return {
      type: SNACKBAR_ALERT,
      error: { ...error, data: { message: alertMsg } },
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  return ClientsClient.listCompanyClients(companyId)
    .then((result: any) => dispatch(success(result)))
    .catch((error: any) => {
      dispatch(alertMessage(error.response));
      dispatch(failure(error));
    });
};

export const addClient = (
  clientData: ClientFormData,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: ADD_CLIENT_REQUEST };
  }

  function success(payload: Client) {
    return { type: ADD_CLIENT_SUCCESS, payload };
  }

  function failure(error: string) {
    return { type: ADD_CLIENT_FAILURE, error };
  }

  function addCompanyAction(payload: Company) {
    return {
      type: ADD_COMPANY_SUCCESS,
      payload,
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  try {
    const result = await ClientsClient.addClient(clientData);
    if (
      result &&
      result.succeededIds &&
      result.succeededIds.length > 0 &&
      result.createdItems &&
      result.createdItems.length &&
      (!result.failedIds || result.failedIds.length < 1)
    ) {
      dispatch(success(result.createdItems[0]));
      if (result.createdItems.length > 1) {
        dispatch(addCompanyAction(result.createdItems[1]));
      }
      dispatch(
        alertSnackbar({
          successMessage: `Success: ${clientData &&
            clientData.cognitoFirstName} has been created.`,
        }),
      );
    } else {
      throw Error();
    }
  } catch (error) {
    dispatch(
      alertSnackbar({
        axiosError: error.response,
        errorMessage: `Error: ${clientData &&
          clientData.cognitoFirstName} could not be created. Support has been notified to investigate the issue.`,
      }),
    );
    dispatch(failure(error));
  }
};

export const inviteClient = (
  userId: string,
  userFirstName: string,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: INVITE_CLIENT_REQUEST };
  }

  function success(invitedUserId: string, inviteUserId: string) {
    return { type: INVITE_CLIENT_SUCCESS, invitedUserId, inviteUserId };
  }

  function failure(error: string) {
    return { type: INVITE_CLIENT_FAILURE, error };
  }

  function alertMessage(error: AxiosResponse, alertMessageType = '') {
    let alertMsg = '';
    if (error) {
      const { data, status } = error;
      const { message } = data;
      if (message) {
        return { type: SNACKBAR_ALERT, error, alertMessageType };
      }
      alertMsg =
        status === 409
          ? message
          : 'Sorry, there was a problem to invite client';
    } else {
      alertMsg = `Error: We could not invite ${userFirstName}. Support has been notified to investigate the issue.`;
    }

    return {
      type: SNACKBAR_ALERT,
      error: { ...error, data: { message: alertMsg } },
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  try {
    const result = await ClientsClient.inviteClient(userId);
    if (result as Client) {
      dispatch(success(userId, result.fields.invitedBy));
      dispatch(
        alertMessage(
          {
            data: {
              message: `Success: ${userFirstName} was sent an email to activate his account.`,
            },
          } as AxiosResponse,
          SUCCESS,
        ),
      );
    } else {
      throw Error();
    }
  } catch (error) {
    dispatch(alertMessage(error.response));
    dispatch(failure(error));
  }
};

export const clearClientsAction = () => ({
  type: CLEAR_CLIENTS,
});

export const deleteClient = (
  userId: string,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: DELETE_CLIENTS_REQUEST };
  }

  function success(payload: string) {
    return { type: DELETE_CLIENTS_SUCCESS, payload };
  }

  function failure(error: string) {
    return { type: DELETE_CLIENTS_FAILED, error };
  }

  function alertMessage(error: string) {
    const alertMsg = error || 'Failed to remove client user';

    return {
      type: SNACKBAR_ALERT,
      error: alertMsg,
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  try {
    const result = await UsersClient.deleteUser(userId);
    dispatch(success(result.id));
  } catch (error) {
    dispatch(failure(error));
    dispatch(alertMessage(error.response));
  }
};

export const deleteCompany = (
  company: Company
): AppThunkAction => async dispatch => {
  console.log("company", company)
  function request() {
    return { type: DELETE_COMPANY_REQUEST };
  }

  function success(payload: string) {
    return { type: DELETE_COMPANY_SUCCESS, payload };
  }

  function failure(error: string) {
    return { type: DELETE_COMPANY_FAILED, error };
  }

  dispatch(clearAlertMessage());
  dispatch(request());
  try {
    const result = await ClientsClient.deleteCompany(company);
    if (result && result.success_count > 0 && result.failed_ids.length < 1) {
      dispatch(success(company.id));
      dispatch(
        alertSnackbar({
          successMessage: `Success: ${company && company.fields && company.fields.name} has been deleted.`,
        }),
      );
    } else {
      throw Error();
    }
  } catch (error) {
    dispatch(failure(error));
    dispatch(
      alertSnackbar({
        axiosError: error.response,
        errorMessage: `Error: ${company && company.fields && company.fields.name} could not be deleted. Support has been notified to investigate the issue.`,
      }),
    );
  }
};

export const updateCompany = (
  clientData: CompanyFormData,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: UPDATE_COMPANY_REQUEST };
  }

  function success(payload: CompanyFormData) {
    return { type: UPDATE_COMPANY_SUCCESS, payload };
  }

  function failure(error: string) {
    return { type: UPDATE_COMPANY_FAILURE, error };
  }

  function alertMessage(error: AxiosResponse) {
    let alertMsg = '';
    if (error) {
      const { data, status } = error;
      const { message } = data;
      if (message) {
        return { type: SNACKBAR_ALERT, error };
      }
      alertMsg =
        status === 409 ? message : 'Sorry, there was a problem to add client';
    } else {
      alertMsg = 'Failed to update client';
    }

    return {
      type: SNACKBAR_ALERT,
      error: { ...error, data: { message: alertMsg } },
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  try {
    const result = await ClientsClient.updateCompany(clientData);
    if (result && result.success_count > 0 && result.failed_ids.length < 1) {
      dispatch(success(clientData));
    } else throw Error();
  } catch (error) {
    dispatch(alertMessage(error.response));
    dispatch(failure(error));
  }
};

export const updateClientUser = (
  clientData: ClientFormData,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: UPDATE_CLIENT_REQUEST };
  }

  function success(payload: ClientFormData) {
    return { type: UPDATE_CLIENT_SUCCESS, payload };
  }

  function failure(error: string) {
    return { type: UPDATE_CLIENT_FAILURE, error };
  }

  function alertMessage(error: AxiosResponse) {
    let alertMsg = '';
    if (error) {
      const { data, status } = error;
      const { message } = data;
      if (message) {
        return { type: SNACKBAR_ALERT, error };
      }
      alertMsg =
        status === 409 ? message : 'Sorry, there was a problem to add client';
    } else {
      alertMsg = 'Failed to update client';
    }

    return {
      type: SNACKBAR_ALERT,
      error: { ...error, data: { message: alertMsg } },
    };
  }

  dispatch(clearAlertMessage());
  dispatch(request());

  try {
    const result = await UsersClient.updateClientUser(clientData);

    if (
      result &&
      result.succeededIds &&
      result.succeededIds.length > 0 &&
      (!result.failedIds || (result.failedIds && result.failedIds.length < 1))
    ) {
      dispatch(success(clientData));
    } else {
      throw Error();
    }
  } catch (error) {
    dispatch(alertMessage(error.response));
    dispatch(failure(error));
  }
};

export const addCompany = (
  clientData: ClientFormData,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: ADD_COMPANY_REQUEST };
  }

  function success(payload: Client) {
    return { type: ADD_COMPANY_SUCCESS, payload };
  }

  function failure(error: string) {
    return { type: ADD_COMPANY_FAILURE, error };
  }
  dispatch(clearAlertMessage());
  dispatch(request());

  try {
    const result = await ClientsClient.createCompany(clientData);
    if (
      result &&
      result.succeededIds &&
      result.succeededIds.length > 0 &&
      result.createdItems &&
      result.createdItems.length &&
      (!result.failedIds || result.failedIds.length < 1)
    ) {
      dispatch(success(result.createdItems[0]));

      dispatch(
        alertSnackbar({
          successMessage: `Success: ${clientData &&
            clientData.companyName} has been created.`,
        }),
      );
    } else {
      throw Error();
    }
  } catch (error) {
    dispatch(
      alertSnackbar({
        axiosError: error.response,
        errorMessage: `Error: ${clientData &&
          clientData.companyName} could not be created. Support has been notified to investigate the issue.`,
      }),
    );
    dispatch(failure(error));
  }
};
