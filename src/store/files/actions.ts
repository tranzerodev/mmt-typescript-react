import { API } from 'aws-amplify';
import { AppThunkAction } from '../reduxTypes';
import {
  FilesActionTypes,
  SendFilesResponse,
  FileResponse,
  SelectedClient,
} from './types';
import { clearAlertMessage } from '../ui/actions';
import { SNACKBAR_ALERT, SUCCESS, ERROR } from '../ui/types';

const lightoutApi = 'LightoutApi';
const url = '/files';

export const getFiles = (): AppThunkAction => async dispatch => {
  function request() {
    return { type: FilesActionTypes.GET_FILES };
  }

  function success(res: File) {
    return { type: FilesActionTypes.GET_FILES_SUCCESS, payload: res };
  }

  function error(err: string) {
    return { type: FilesActionTypes.GET_FILES_ERROR, payload: err };
  }

  dispatch(request());

  try {
    const res = await API.get(lightoutApi, url, {});
    dispatch(success(res));
  } catch (err) {
    dispatch(error(err));
  }
};

export const saveUploadedFiles = (
  files: Array<{ key: string }>,
  selectedCompanyId?: string,
): AppThunkAction => async dispatch => {
  function request() {
    return { type: FilesActionTypes.SAVE_UPLOADED_FILES };
  }

  function success(res: SendFilesResponse) {
    return { type: FilesActionTypes.SAVE_UPLOADED_FILES_SUCCESS, payload: res };
  }

  function error(err: string) {
    return { type: FilesActionTypes.SAVE_UPLOADED_FILES_ERROR, payload: err };
  }

  dispatch(request());

  const filesList = files.map(file => ({
    fields: {
      fileKey: file.key,
      starred: false,
      tags: [],
    },
  }));

  const urlStaged = `${url}?companyId=${selectedCompanyId}`;

  try {
    const res = await API.post(lightoutApi, urlStaged, {
      body: {
        data: filesList,
      },
    });

    dispatch(success(res));
    dispatch(getFiles());
  } catch (ex) {
    dispatch(error(ex));
  }
};

export const saveUserFiles = (files: Array<FileResponse>) => ({
  type: FilesActionTypes.SAVE_USER_FILES,
  payload: files,
});

export const deleteFiles = (
  files: Array<FileResponse>,
): AppThunkAction => async dispatch => {
  const alertMessage = (
    message: { data: { message: string } },
    messageType: string,
  ) => ({
    type: SNACKBAR_ALERT,
    error: message,
    alertMessageType: messageType,
  });
  const filesPosfix = files.length > 1 ? 's' : '';

  try {
    await API.del(lightoutApi, url, {
      body: {
        data: files,
      },
    });
    const successMessage = {
      data: {
        message: `The file${filesPosfix} have been deleted.`,
      },
    };
    dispatch(clearAlertMessage());
    dispatch(alertMessage(successMessage, SUCCESS));
    dispatch(getFiles());
  } catch (e) {
    const errorMessage = {
      data: {
        message: `The file${filesPosfix} could not be deleted. Support has been notified to investigate the issue.`,
      },
    };
    dispatch(clearAlertMessage());
    dispatch(alertMessage(errorMessage, ERROR));
  }
};

export const selectClient = (client: SelectedClient) => ({
  type: FilesActionTypes.SELECT_USER_FILES,
  payload: client,
});
