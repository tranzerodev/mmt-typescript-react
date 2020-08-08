import { AUTH_STATES } from './authConsts';

export const UNAUTH_USER_ID = 'unauth';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const EMPTY_FNC = () => {};

export const DASHBOARD_PAGE_HOME = '/dashboard?page=home';

export const DASHBOARD_PAGE = '/dashboard';

export const ENDPOINTS_PAGE = '/endpoints';

export const MOVING_ENDPOINTS_PAGE = '/moving-endpoints';

export const PRODUCTS_PAGE = '/products';

export const COMPANIES_PAGE = '/clients/companies';

export const USERS_PAGE = '/clients/users';

export const EXPERIENCE_SETUP_PAGE = '/create-ad';

export const MARKETING_PAGE_URL = 'https://www.lightout.com';

export const EXPERIENCES_PAGE = '/feed';

export const PACKAGES_PAGE = '/packages';

export const LOGIN_PAGE = `/login?step=${AUTH_STATES.SIGN_IN}`;

export const REGISTER_PAGE = `/login?step=${AUTH_STATES.SIGN_UP}`;

export const REQUIRE_NEW_PASSWORD = `/login?step=${
  AUTH_STATES.REQUIRE_NEW_PASSWORD
}`;

export const CONFIRM_REGISTER_PAGE = `/login?step=${
  AUTH_STATES.CONFIRM_SIGN_UP
}`;

export const FORGOT_PASSWORD_PAGE = `/login?step=${
  AUTH_STATES.FORGOT_PASSWORD
}`;

export const HOME_PAGE_PATH = DASHBOARD_PAGE;

export const SETTINGS_PAGE = '/settings';

export const RESOURCES_PAGE = '/resources';

export const FILES_PAGE = '/files';

export * from './stringConsts';
