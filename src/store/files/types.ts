import { BaseEntity } from '../../constants/dataTypes';

export enum FilesActionTypes {
  GET_FILES = 'GET_FILES',
  GET_FILES_SUCCESS = 'GET_FILES_SUCCESS',
  GET_FILES_ERROR = 'GET_FILES_ERROR',
  SAVE_UPLOADED_FILES = 'SAVE_UPLOADED_FILES',
  SAVE_UPLOADED_FILES_SUCCESS = 'SAVE_UPLOADED_FILES_SUCCESS',
  SAVE_UPLOADED_FILES_ERROR = 'SAVE_UPLOADED_FILES_ERROR',
  SAVE_USER_FILES = 'SAVE_USER_FILES',
  SELECT_USER_FILES = 'SELECT_USER_FILES',
}

export interface SelectedClient {
  clientType: 'owner' | '' | undefined;
  clientId: string;
}

export interface Fields {
  fileKey: string;
  fileUrl?: string;
  starred: boolean;
  tags: Array<string>;
  fileName?: string;
}

export interface SendFilesResponse {
  reatedItems: Array<string>;
  failedIds: Array<string>;
  succeededIds: Array<string>;
}

export interface FileResponse extends BaseEntity {
  fields: Fields;
}

export interface FilesState {
  items: FileResponse[];
  userItems: Array<FileResponse>;
  selectedClient: SelectedClient;
  loading: boolean;
  loaded: boolean;
  error?: string;
}

interface GetFiles {
  type: typeof FilesActionTypes.GET_FILES;
}

interface GetFilesSuccess {
  type: typeof FilesActionTypes.GET_FILES_SUCCESS;
  payload: File;
}

interface GetFilesError {
  type: typeof FilesActionTypes.GET_FILES_ERROR;
  error: string;
}

interface SendFiles {
  type: typeof FilesActionTypes.SAVE_UPLOADED_FILES;
}

interface SendFilesSuccess {
  type: typeof FilesActionTypes.SAVE_UPLOADED_FILES_SUCCESS;
}

interface SendFilesError {
  type: typeof FilesActionTypes.SAVE_UPLOADED_FILES_ERROR;
  error: string;
}

interface SaveUserFiles {
  type: typeof FilesActionTypes.SAVE_USER_FILES;
  payload: Array<FileResponse>;
}

interface SelectClient {
  type: typeof FilesActionTypes.SELECT_USER_FILES;
  payload: SelectedClient;
}

export type FilesActions =
  | GetFiles
  | GetFilesSuccess
  | GetFilesError
  | SendFiles
  | SendFilesSuccess
  | SendFilesError
  | SaveUserFiles
  | SelectClient;
