import {
  DataState,
  Resource,
  DataActionTypes,
  LOAD_RESOURCES_REQUEST,
  LOAD_RESOURCES_DONE,
  LOAD_RESOURCES_FAIL,
} from './types';

export const initialResource: Resource = {
  id: '',
  fields: {
    Portals: [],
    lastModified: new Date().toDateString(),
    ownerEmail: '',
    tags: [],
    title: '',
    body: '',
  },
};

const initialState: DataState = {
  resources: [],
  resourceUsers: [],
  error: '',
  isLoading: false,
  isLoaded: false,
};

const formatResourceTags = (res: Resource) => {
  const newTags = res.fields.tags.map(tag => tag.replace('_', ' '));
  res.fields.tags = newTags;
  return res;
};

const dataReducer = (state = initialState, action: DataActionTypes) => {
  switch (action.type) {
    case LOAD_RESOURCES_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case LOAD_RESOURCES_DONE: {
      const { resources, users: resourceUsers } = action;
      if (resources) {
        resources.forEach(formatResourceTags);
      }
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        resources,
        resourceUsers,
        error: '',
      };
    }
    case LOAD_RESOURCES_FAIL: {
      const { error } = action;
      return {
        ...state,
        isLoading: false,
        isLoaded: false,
        error,
      };
    }
    default:
      return state;
  }
};

export default dataReducer;
