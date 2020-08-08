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
  RequireNewPassword as AwsRequireNewPassword,
} from 'aws-amplify-react';

class RequireNewPassword extends AwsRequireNewPassword {
  changePassword = () => {
    const { password, newPassword } = this.inputs;
    if (password === newPassword) {
      this.change();
    } else {
      this.error('The entered passwords do not match.');
    }
  };

  showComponent(theme) {
    const { hide } = this.props;
    if (hide && hide.includes(RequireNewPassword)) {
      return null;
    }

    return (
      <FormSection theme={theme}>
        <SectionBody>
          <InputRow
            autoFocus
            placeholder={I18n.get('New Password')}
            theme={theme}
            key="newPassword"
            name="newPassword"
            type="password"
            onChange={this.handleInputChange}
          />
          <InputRow
            placeholder={I18n.get('Confirm New Password')}
            theme={theme}
            key="password"
            name="password"
            type="password"
            onChange={this.handleInputChange}
          />
          <div>
            <ButtonRow theme={theme} onClick={this.changePassword}>
              {I18n.get('Change')}
            </ButtonRow>
            <ActionRow theme={theme} onClick={() => this.changeState('signIn')}>
              <Link theme={theme}>{I18n.get('Back to Sign In')}</Link>
            </ActionRow>
          </div>
        </SectionBody>
      </FormSection>
    );
  }
}

export default RequireNewPassword;
