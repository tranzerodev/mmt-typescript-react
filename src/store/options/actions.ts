import OptionsClient from '../../clients/OptionsClient';
import {
  Options,
  LOAD_OPTIONS,
  LOAD_OPTIONS_DONE,
  CLEAR_OPTIONS,
} from './types';
import { DefaultOptions } from './reducers';
import { AppThunkAction } from '../reduxTypes';
import portalConfig from '../../portalConfig';
import mockProducts from '../mockData/products.json';

export const clearOptions = () => ({
  type: CLEAR_OPTIONS,
});

const startLoadOptions = () => ({
  type: LOAD_OPTIONS,
});

const loadOptionsDone = (optionsData = DefaultOptions, error = '') => {
  const data = optionsData;
  if (portalConfig.useMockProducts) {
    data.types = mockProducts;
  }
  return {
    type: LOAD_OPTIONS_DONE,
    data,
    error,
  };
};

export const loadOptions = (): AppThunkAction => async dispatch => {
  dispatch(startLoadOptions());

  try {
    const options = await OptionsClient.getOptions();
    dispatch(loadOptionsDone(options as Options));
  } catch (ex) {
    dispatch(loadOptionsDone(undefined, ex));
  }
};
