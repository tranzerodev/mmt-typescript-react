import portalConfig from '../portalConfig';

export const AUTH_STATES = {
  SIGNED_IN: 'signedIn',
  SIGNED_UP: 'signedUp',
  SIGN_UP: 'signUp',
  SIGN_IN: 'signIn',
  CONFIRM_SIGN_UP: 'confirmSignUp',
  CONTACT_US: 'contactUs',
  DESKTOP_ONLY_MODAL: 'modalRestricted',
  FORGOT_PASSWORD: 'forgotPassword',
  CONFIRM_SIGN_IN: 'confirmSignIn',
  REQUIRE_NEW_PASSWORD: 'requireNewPassword',
  VERIFY_CONTACT: 'verifyContact',
} as const;

type AuthStateKeys = keyof typeof AUTH_STATES;
export type AuthStateTypes = typeof AUTH_STATES[AuthStateKeys];

export const AUTH_STATE_TO_TITLE = {
  [AUTH_STATES.SIGN_IN]: 'Sign In',
  [AUTH_STATES.SIGN_UP]: `Sign up for ${portalConfig.Company}`,
  [AUTH_STATES.CONTACT_US]: 'Contact Us',
  [AUTH_STATES.DESKTOP_ONLY_MODAL]: 'Mobile Support Coming Soon',
};

export const CONTACT_TEXT = `If you are interested in doing a campaign with ${
  portalConfig.Company
}, please contact us at ${portalConfig.CompanyEmail}`;

export const SIGN_UP_TEXT = `If you are interested in doing a campaign with ${
  portalConfig.Company
}, please create an account with us.`;

export const MOBILE_RESTRICTED_MODAL_DESC = `The ${
  portalConfig.Company
} portal does not support all functionality on mobile devices yet. Please switch to a desktop device.`;
