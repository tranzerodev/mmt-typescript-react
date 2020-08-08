/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { I18n } from 'aws-amplify';
import {
  ActionRow,
  FormSection,
  SectionBody,
  InputRow,
  ButtonRow,
  Link,
  ForgotPassword as AwsForgotPassword,
} from 'aws-amplify-react';
import Theme from '../LightoutTheme';

class ForgotPassword extends AwsForgotPassword {
  changePassword = () => {
    const { password, newPassword } = this.inputs;
    if (password === newPassword) {
      this.change();
    } else {
      this.error('The entered passwords do not match.');
    }
  };

  sendView() {
    const theme = this.props.theme || Theme;
    return (
      <div>
        <div>
          <InputRow
            autoFocus
            placeholder={I18n.get('Enter your username')}
            theme={theme}
            key="username"
            name="username"
            onChange={this.handleInputChange}
          />
        </div>
      </div>
    );
  }

  submitView() {
    const theme = this.props.theme || Theme;
    return (
      <div>
        <InputRow
          placeholder={I18n.get('Code')}
          theme={theme}
          key="code"
          name="code"
          autoComplete="off"
          onChange={this.handleInputChange}
        />
        <InputRow
          placeholder={I18n.get('New Password')}
          theme={theme}
          type="password"
          key="password"
          name="password"
          onChange={this.handleInputChange}
        />
      </div>
    );
  }

  showComponent(theme) {
    const { hide, authData = {} } = this.props;
    if (hide && hide.includes(ForgotPassword)) {
      return null;
    }

    return (
      <FormSection theme={theme}>
        <SectionBody theme={theme}>
          {this.state.delivery || authData.username
            ? this.submitView()
            : this.sendView()}
          <div>
            {this.state.delivery || authData.username ? (
              <ButtonRow theme={theme} onClick={this.submit}>
                {I18n.get('Submit')}
              </ButtonRow>
            ) : (
              <ButtonRow theme={theme} onClick={this.send}>
                {I18n.get('Send Code')}
              </ButtonRow>
            )}
            <ActionRow theme={theme}>
              {this.state.delivery || authData.username ? (
                <Link theme={theme} onClick={this.send}>
                  {I18n.get('Resend Code')}
                </Link>
              ) : (
                <Link theme={theme} onClick={() => this.changeState('signIn')}>
                  {I18n.get('Back to Sign In')}
                </Link>
              )}
            </ActionRow>
          </div>
        </SectionBody>
      </FormSection>
    );
  }
}

export default ForgotPassword;
