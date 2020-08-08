import { FilesState, FilesActions, FilesActionTypes } from './types';

const initialState: FilesState = {
  items: [],
  userItems: [],
  loading: false,
  loaded: false,
  selectedClient: {
    clientType: '',
    clientId: '',
  },
  error: '',
};

const FilesReducer = (state = initialState, action: FilesActions) => {
  switch (action.type) {
    case FilesActionTypes.GET_FILES:
    case FilesActionTypes.SAVE_UPLOADED_FILES:
      return {
        ...state,
        loading: true,
        loaded: false,
      };
    case FilesActionTypes.GET_FILES_ERROR:
    case FilesActionTypes.SAVE_UPLOADED_FILES_ERROR:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      };
    case FilesActionTypes.GET_FILES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: action.payload,
      };
    case FilesActionTypes.SAVE_UPLOADED_FILES_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case FilesActionTypes.SAVE_USER_FILES:
      return {
        ...state,
        userItems: action.payload,
      };
    case FilesActionTypes.SELECT_USER_FILES:
      return {
        ...state,
        selectedClient: action.payload,
      };
    default:
      return state;
  }
};

export default FilesReducer;
