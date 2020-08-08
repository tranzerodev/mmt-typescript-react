import {
  Options,
  OptionsState,
  OptionsActionTypes,
  LOAD_OPTIONS,
  LOAD_OPTIONS_DONE,
} from './types';

export const DefaultOptions: Options = {
  categories: [],
  types: [],
  dmas: [],
  performanceModules: [],
};

const initialState: OptionsState = {
  data: DefaultOptions,
  loaded: false,
  loading: false,
  error: '',
};

const optionsReducer = (state = initialState, action: OptionsActionTypes) => {
  switch (action.type) {
    case LOAD_OPTIONS: {
      return {
        ...state,
        loaded: false,
        loading: true,
        error: '',
      };
    }
    case LOAD_OPTIONS_DONE: {
      const { data, error } = action;
      return {
        ...state,
        loading: false,
        loaded: true,
        error,
        data,
      };
    }

    default:
      return state;
  }
};

export default optionsReducer;
