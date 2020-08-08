import unionBy from 'lodash/unionBy';
import {
  Package,
  PackagesState,
  PackagesActionTypes,
  LOADING_PACKAGES,
  LOAD_PACKAGES_DONE,
  LOAD_PACKAGE_DONE,
  CREATE_PACKAGE_REQUEST,
  CREATE_PACKAGE_SUCCESS,
  CREATE_PACKAGE_FAILURE,
  UPDATING_PACKAGE,
  UPDATE_PACKAGE_DONE,
  DELETE_PACKAGE_REQUEST,
  DELETE_PACKAGE_SUCCESS,
  DELETE_PACKAGE_FAILED,
  CLEAR_PACKAGES,
} from './types';

const initialState: PackagesState = {
  items: [],
  isLoading: false,
  error: '',
  loadedPackages: false,
  // creatingPackage: false,
  updatingPackage: false,
  removingPackage: false,
  removePackageId: '',
};

const formatPackageDates = (pack: Package) => {
  if (pack.startDate && !pack.startDate.includes('T')) {
    // eslint-disable-next-line no-param-reassign
    pack.startDate = `${pack.startDate}T00:00:00.000Z`;
  }

  if (pack.endDate && !pack.endDate.includes('T')) {
    // eslint-disable-next-line no-param-reassign
    pack.endDate = `${pack.endDate}T23:59:59.999Z`;
  }
  return pack;
};

const packagesReducer = (state = initialState, action: PackagesActionTypes) => {
  switch (action.type) {
    case CLEAR_PACKAGES:
      return {
        ...state,
        loadedPackages: false,
        items: [],
      };
    case LOADING_PACKAGES:
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case LOAD_PACKAGES_DONE: {
      const { packages, error } = action;
      if (packages) {
        packages.forEach(formatPackageDates);
      }
      return {
        ...state,
        isLoading: false,
        loadedPackages: true,
        updatingPackage: false,
        removingPackage: false,
        items: packages || [],
        error,
      };
    }
    case CREATE_PACKAGE_REQUEST:
      return {
        ...state,
        updatingPackage: true,
        error: '',
      };
    case CREATE_PACKAGE_SUCCESS: {
      const newPackage = action.payload;
      const { items } = state;
      const updatedItems = items.concat(newPackage);
      return {
        ...state,
        items: updatedItems,
        updatingPackage: false,
        error: '',
      };
    }
    case CREATE_PACKAGE_FAILURE: {
      const { error } = action;
      return {
        ...state,
        updatingPackage: false,
        error,
      };
    }
    case UPDATING_PACKAGE:
      return {
        ...state,
        updatingPackage: true,
        error: '',
      };
    case UPDATE_PACKAGE_DONE: {
      const { packages, error } = action;
      let errorMessage = '';
      if (error.status === 403) {
        errorMessage = 'You are not allowed to edit this package';
      } else {
        errorMessage = 'Sorry, there was a problem saving this Package';
      }

      if (packages) {
        packages.forEach(formatPackageDates);
      }
      const packageList = unionBy(packages, state.items, 'id');
      return {
        ...state,
        isLoading: false,
        updatingPackage: false,
        removingPackage: false,
        items: packageList || [],
        error: errorMessage,
      };
    }
    case DELETE_PACKAGE_REQUEST: {
      const { packageId } = action;

      return {
        ...state,
        removePackageId: packageId,
        removingPackage: true,
        error: '',
      };
    }
    case DELETE_PACKAGE_SUCCESS: {
      const {
        payload: { packageId },
      } = action;
      const { items } = state;
      const updatedItems = items.filter(item => item.id !== packageId);

      return {
        ...state,
        items: updatedItems,
        removingPackage: false,
      };
    }
    case DELETE_PACKAGE_FAILED: {
      const { error } = action;

      return {
        ...state,
        removingPackage: false,
        error,
      };
    }
    case LOAD_PACKAGE_DONE: {
      const { item } = action;
      formatPackageDates(item);
      const packageList = unionBy([item], state.items, 'id');

      return {
        ...state,
        items: packageList || [],
      };
    }

    default:
      return state;
  }
};

export default packagesReducer;
