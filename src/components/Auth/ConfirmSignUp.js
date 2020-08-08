/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Auth, I18n } from 'aws-amplify';
import {
  ConfirmSignUp as AwsConfirmSignUp,
  FormSection,
  SectionBody,
  InputRow,
  ActionRow,
  MessageRow,
  ButtonRow,
  Link,
} from 'aws-amplify-react';
import { AUTH_STATES } from '../../constants/authConsts';

class ConfirmSignUp extends AwsConfirmSignUp {
  confirm = async () => {
    const username = this.usernameFromAuthData() || this.inputs.username;
    const { code } = this.inputs;
    const { authData } = this.props;
    if (!Auth || typeof Auth.confirmSignUp !== 'function') {
      throw new Error(
        'No Auth module found, please ensure @aws-amplify/auth is imported',
      );
    }
    try {
      await Auth.confirmSignUp(username, code);
      this.changeState(AUTH_STATES.SIGNED_UP, {
        username,
        password: authData.password,
      });
    } catch (err) {
      this.error(err);
    }
  };

  showComponent(theme) {
    const { hide } = this.props;
    const username = this.usernameFromAuthData();

    if (hide && hide.includes(ConfirmSignUp)) {
      return null;
    }

    return (
      <FormSection theme={theme}>
        <SectionBody theme={theme}>
          {username ? (
            <MessageRow>
              Enter the verification code sent to your email
            </MessageRow>
          ) : (
            <InputRow
              placeholder={I18n.get('Username')}
              theme={theme}
              key="username"
              name="username"
              onChange={this.handleInputChange}
            />
          )}
          <InputRow
            autoFocus
            placeholder={I18n.get('Code')}
            theme={theme}
            key="code"
            name="code"
            autoComplete="off"
            onChange={this.handleInputChange}
          />
          <ButtonRow theme={theme} onClick={this.confirm}>
            {I18n.get('Confirm')}
          </ButtonRow>
          <ActionRow theme={theme}>
            <Link theme={theme} onClick={this.resend}>
              {I18n.get('Resend Code')}
            </Link>
          </ActionRow>
        </SectionBody>
      </FormSection>
    );
  }
}

export default ConfirmSignUp;
