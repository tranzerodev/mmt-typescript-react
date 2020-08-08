import {
  ExperiencesState,
  ExperiencesActionTypes,
  LOAD_EXPERIENCES_REQUEST,
  LOAD_EXPERIENCES_SUCCESS,
  LOAD_EXPERIENCES_FAILURE,
} from './types';

const initialState: ExperiencesState = {
  items: [],
  loadingPackage: false,
  loadingFeed: false,
  error: '',
  feedInitialized: false,
};

const experiencesReducer = (
  state = initialState,
  action: ExperiencesActionTypes,
) => {
  switch (action.type) {
    case LOAD_EXPERIENCES_REQUEST:
      return {
        ...state,
        loadingFeed: true,
        error: null,
      };

    case LOAD_EXPERIENCES_SUCCESS: {
      const { experiences } = action;
      return {
        ...state,
        loadingFeed: false,
        feedInitialized: true,
        items: experiences || [],
      };
    }

    case LOAD_EXPERIENCES_FAILURE: {
      const { error } = action;
      return {
        ...state,
        loadingFeed: false,
        feedInitialized: false,
        error,
      };
    }

    default:
      return state;
  }
};

export default experiencesReducer;
