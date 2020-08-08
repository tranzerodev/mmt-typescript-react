import {
  SET_RUNTIME_VARIABLE,
  RuntimePayload,
  SetRuntimeAction,
} from './types';

export const setRuntimeVariable: (
  payload: RuntimePayload,
) => SetRuntimeAction = ({ name, value }) => ({
  type: SET_RUNTIME_VARIABLE,
  payload: {
    name,
    value,
  },
});
