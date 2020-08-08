/* eslint-disable max-classes-per-file */
import React from 'react';
import { AuthStateTypes } from '../../constants/authConsts';

declare module 'aws-amplify-react' {
  interface WithStylesProps {
    classes: any;
  }

  export interface SignInProps extends WithStylesProps {
    hide: Array<string>;
    authState: string;
  }

  export interface SignUpProps extends WithStylesProps {
    authState: string;
  }

  export interface ConfirmSignUpProps extends WithStylesProps {
    authData: any;
  }

  export interface ReqiureNewPasswordProps extends WithStylesProps {
    authData: any;
  }

  export interface ForgotPasswordProps extends WithStylesProps {
    authData: any;
  }
  export class SignIn extends React.Component<SignInProps, any> {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    signIn: () => Promise<any>;

    changeState: (state: string) => void;
  }

  export class SignUp extends React.Component<SignUpProps, any> {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    signUp: () => Promise<any>;

    changeState: (state: string, data?: {}) => void;

    error: (err: any) => void;
  }

  export class ConfirmSignUp extends React.Component<ConfirmSignUpProps, any> {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    changeState: (state: string, data?: {}) => void;

    error: (err: any) => void;

    usernameFromAuthData: () => string;

    resend: () => void;
  }

  export class RequireNewPassword extends React.Component<
    ReqiureNewPasswordProps,
    any
  > {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    changeState: (state: string, data?: {}) => void;

    error: (err: any) => void;

    usernameFromAuthData: () => string;

    change: () => Promise<any>;

    inputs: any;
  }

  export class ForgotPassword extends React.Component<
    ForgotPasswordProps,
    any
  > {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    changeState: (state: string, data?: {}) => void;

    error: (err: any) => void;

    submit: () => Promise<any>;

    send: () => Promise<any>;

    change: () => void;

    inputs: any;
  }

  interface AuthenticatorProps {
    hideDefault: boolean;
    authState: string | null | undefined;
    onStateChange: (state: AuthStateTypes, data?: any) => void;
    errorMessage: (message: string) => string | null;
  }

  export class Authenticator extends React.Component<AuthenticatorProps> {}
}
