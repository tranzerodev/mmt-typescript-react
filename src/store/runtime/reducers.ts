import { SET_RUNTIME_VARIABLE, SetRuntimeAction } from './types';

export default function runtime(state = {}, action: SetRuntimeAction) {
  switch (action.type) {
    case SET_RUNTIME_VARIABLE:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
}
