import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Authenticator } from 'aws-amplify-react';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import theme from '../LightoutTheme';
import AutoSignIn from './AutoSignIn';
import ConfirmSignUp from './ConfirmSignUp';
import ForgotPassword from './ForgotPassword';
import NewUserSignIn from './NewUserSignIn';
import RequireNewPassword from './RequireNewPassword';
import SignIn from './SignIn';
import { SimpleModal, ActionButtonModal } from '../Modals';

import { closeAuthModal } from '../../store/ui/actions';
import {
  AUTH_STATE_TO_TITLE,
  AUTH_STATES,
  CONTACT_TEXT,
  MOBILE_RESTRICTED_MODAL_DESC,
  SIGN_UP_TEXT,
} from '../../constants/authConsts';
import history from '../../history';
import { REGISTER_PAGE } from '../../constants';

class AuthModal extends Component {
  handleStateChange = state => {
    if (state === AUTH_STATES.SIGNED_IN) {
      window.location.href = '/';
    }
  };

  render() {
    const { authState, closeModal } = this.props;
    const modalProps = { open: false, onClose: closeModal };
    if (authState) {
      modalProps.open = true;
      if (authState === AUTH_STATES.SIGN_UP) {
        modalProps.disableEscapeKeyDown = true;
        modalProps.disableBackdropClick = true;
      }
    }

    const authenticatorChildren = [
      <ForgotPassword key="forgotPassword" />,
      <RequireNewPassword key="authNewPassword" />,
      <ConfirmSignUp key="authConfirmSignUp" />,
    ];
    if (authState === AUTH_STATES.SIGN_UP) {
      authenticatorChildren.push(<NewUserSignIn key="authSignUp" />);
      authenticatorChildren.push(<AutoSignIn key="authSignIn" />);
    } else {
      authenticatorChildren.push(<SignIn key="authSignIn" />);
    }

    const handleSignupClicked = () => {
      history.push(REGISTER_PAGE);
      closeModal();
    };

    const renderModal = () => {
      switch (authState) {
        case AUTH_STATES.CONTACT_US:
          return (
            <ActionButtonModal
              label="contactus"
              description="Contact Us Modal"
              title={AUTH_STATE_TO_TITLE[authState] || 'Contact Us'}
              mainComponent={CONTACT_TEXT}
              {...modalProps}
            />
          );
        case AUTH_STATES.DESKTOP_ONLY_MODAL:
          return (
            <ActionButtonModal
              label="desktoponly"
              description="Desktop Only Modal"
              title={AUTH_STATE_TO_TITLE[AUTH_STATES.DESKTOP_ONLY_MODAL]}
              mainComponent={
                <>
                  <Typography variant="h4">
                    {MOBILE_RESTRICTED_MODAL_DESC}
                  </Typography>
                </>
              }
              {...modalProps}
            />
          );
        case AUTH_STATES.SIGN_UP:
          return (
            <ActionButtonModal
              label="signup"
              description="Sign up Modal"
              title={AUTH_STATE_TO_TITLE[authState] || 'Sign up'}
              mainComponent={SIGN_UP_TEXT}
              positiveAction
              positiveActionText="Signup"
              onPositiveActionPerformed={handleSignupClicked}
              {...modalProps}
            />
          );
        default:
          return (
            <SimpleModal
              label="authentication"
              description="SignIn/Signup Modal"
              title={AUTH_STATE_TO_TITLE[authState] || 'Welcome'}
              mainComponent={
                <Authenticator
                  hideDefault
                  authState={authState}
                  theme={theme}
                  onStateChange={this.handleStateChange}
                >
                  {authenticatorChildren}
                </Authenticator>
              }
              closeButton
              {...modalProps}
            />
          );
      }
    };

    return <div>{renderModal()}</div>;
  }
}

AuthModal.defaultProps = {
  authState: null,
};

AuthModal.propTypes = {
  authState: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authState: state.ui.authType,
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeAuthModal()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthModal);
