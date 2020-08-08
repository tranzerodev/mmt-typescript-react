/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { I18n } from 'aws-amplify';
import { connect } from 'react-redux';
import {
  ActionRow,
  ButtonRow,
  FederatedButtons,
  FormSection,
  InputRow,
  Link,
  SectionBody,
  SignIn as AwsSignIn,
} from 'aws-amplify-react';
import { Spinner } from '../Loading';

class SignIn extends AwsSignIn {
  constructor() {
    super();
    this.state = {
      signInLoading: false,
    };
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    if (this.signInTimer) {
      clearTimeout(this.signInTimer);
    }
  }

  onKeyDown(e) {
    if (this.props.authState === 'signIn' && !this.props.hide) {
      if (e.keyCode === 13) {
        // when press enter
        this.startSignIn();
      }
    }
  }

  startSignIn = () => {
    this.setState({ signInLoading: true }, () => {
      this.signIn();
      this.signInTimer = setTimeout(() => {
        this.setState({ signInLoading: false });
      }, 2000);
    });
  };

  forgotPasswordClicked = () => {
    this.changeState('forgotPassword');
  };

  showComponent(theme) {
    const { authState, hide = [], federated, onStateChange } = this.props;
    if (hide && hide.includes(SignIn)) {
      return null;
    }

    return (
      <div>
        <FormSection theme={theme}>
          <SectionBody theme={theme}>
            <InputRow
              autoFocus
              placeholder={I18n.get('Email')}
              theme={theme}
              key="username"
              name="username"
              onChange={this.handleInputChange}
            />
            <InputRow
              placeholder={I18n.get('Password')}
              theme={theme}
              key="password"
              type="password"
              name="password"
              onChange={this.handleInputChange}
            />
            {this.state.signInLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '15px',
                }}
              >
                <Spinner />
              </div>
            ) : (
              <div>
                <ButtonRow theme={theme} onClick={this.startSignIn}>
                  {I18n.get('Sign In')}
                </ButtonRow>
                <ActionRow theme={theme} onClick={this.forgotPasswordClicked}>
                  <Link theme={theme}>Forgot Password</Link>
                </ActionRow>
              </div>
            )}
            <FederatedButtons
              federated={federated}
              theme={theme}
              authState={authState}
              onStateChange={onStateChange}
            />
          </SectionBody>
        </FormSection>
      </div>
    );
  }
}

export default connect(() => ({}))(SignIn);
