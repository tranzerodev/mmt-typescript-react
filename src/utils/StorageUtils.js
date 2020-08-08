import { initialState as defaultUserState } from '../store/user/reducers';

const LIGHOUT_STATE_KEY = 'h38v29jajj9dje2bx';

export const getCookie = name => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts
      .pop()
      .split(';')
      .shift();
  }

  return null;
};

export const setCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
};

export const loadState = storage => {
  try {
    const serializedState = storage
      ? storage[LIGHOUT_STATE_KEY]
      : getCookie(LIGHOUT_STATE_KEY);

    if (!serializedState) {
      return undefined;
    }

    const prevState = JSON.parse(serializedState);
    const prevUser = prevState.user;
    if (prevUser) {
      prevUser.loaded = false;
      Object.keys(defaultUserState).forEach(userPropKey => {
        if (!(userPropKey in prevUser)) {
          prevUser[userPropKey] = defaultUserState[userPropKey];
        }
      });
    }

    return prevState;
  } catch (err) {
    return undefined;
  }
};

const getSavableState = state => {
  const savableState = {};
  Object.keys(state).forEach(stateKey => {
    // assign each property in state to savable state dict
    let stateVal = state[stateKey];
    if (stateKey === 'user') {
      // for user prop, create new user obj to add to state
      // where certain keys are modified
      const user = {};
      const stateKeys = Object.keys(stateVal);
      stateKeys
        .filter(k => k !== 'instance')
        .forEach(userKey => {
          user[userKey] = stateVal[userKey];
        });
      stateVal = user;
    }

    savableState[stateKey] = stateVal;
  });
  return savableState;
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(getSavableState(state));
    setCookie(LIGHOUT_STATE_KEY, serializedState);
  } catch (err) {
    // ignore error in saving state
  }
};
