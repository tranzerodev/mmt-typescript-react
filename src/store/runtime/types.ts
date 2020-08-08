export const SET_RUNTIME_VARIABLE = 'SET_RUNTIME_VARIABLE';

export interface RuntimePayload {
  name: string;
  value: string;
}

export interface SetRuntimeAction {
  type: typeof SET_RUNTIME_VARIABLE;
  payload: RuntimePayload;
}
