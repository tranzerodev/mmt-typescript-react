/* eslint-disable jsx-a11y/anchor-is-valid,no-underscore-dangle */
import React from 'react';
import { Auth, I18n } from 'aws-amplify';
import {
  ActionRow,
  FormSection,
  SectionBody,
  InputRow,
  ButtonRow,
  Link,
  MessageRow,
  SignUp,
} from 'aws-amplify-react';
import { connect } from 'react-redux';
import { AUTH_STATES } from '../../constants/authConsts';
import { openAuthModal } from '../../store/ui/actions';
import { UsersApi } from '../../clients';
import { insertLeadTrackingScript } from '../../DOMUtils';

const uuid = require('uuid/v4');

const passwordMismatch = 'Your passwords do not match';
const emptySignUpField = 'Please fill out all fields';
const inputKeys = [
  'firstName',
  'lastName',
  'companyName',
  'password',
  'confirmPassword',
  'email',
  'phoneNumber',
  'dialCode',
  'promoCode',
];
const parseInputs = inputs => {
  const result = { ...inputs };
  inputKeys.forEach(k => {
    if (inputs[k]) {
      result[k] = inputs[k].trim();
    }
  });
  return result;
};

const TermsAndConditionsUrl = 'advertising-terms-and-conditions.html';
const PrivacyPolicyUrl = 'privacypolicy.html';

class NewUserSignIn extends SignUp {
  constructor(props) {
    super(props);

    this._validAuthStates = [AUTH_STATES.SIGN_IN];
    this.signUp = this.signUp.bind(this);
  }

  async signUp() {
    const {
      firstName,
      lastName,
      companyName,
      password,
      confirmPassword,
      email,
      phoneNumber = '4159642030',
      dialCode = '+1',
      promoCode,
    } = parseInputs(this.inputs);

    if (!Auth || typeof Auth.signUp !== 'function') {
      throw new Error(
        'No Auth module found, please ensure @aws-amplify/auth is imported',
      );
    }

    if (
      !firstName ||
      !lastName ||
      !companyName ||
      !password ||
      !confirmPassword ||
      !email
    ) {
      this.error(emptySignUpField);
      return;
    }
    if (password !== confirmPassword) {
      this.error(passwordMismatch);
      return;
    }

    const username = uuid();
    const promoCodePromise = promoCode
      ? UsersApi.validatePromoCode(promoCode)
      : Promise.resolve({ success: true });
    try {
      const result = await promoCodePromise;
      if (!result.success) {
        throw new Error('The promo code you entered is invalid.');
      }
      insertLeadTrackingScript();
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          phone_number: `${dialCode}${phoneNumber.replace(/[-()]/g, '')}`,
          given_name: firstName,
          family_name: lastName,
          'custom:companyName': companyName,
        },
      });
      await UsersApi.newUserSignUp({
        userId: username,
        promoCode,
      });
      await this.changeState(AUTH_STATES.SIGNED_UP, {
        username,
        password,
        promoCode,
      });
    } catch (err) {
      const parsedError = err.message
        ? err.message.replace('PreSignUp failed with error ', '')
        : '';
      this.error(parsedError || err);
    }
  }

  showComponent(theme) {
    const { hide } = this.props;
    if (hide && hide.includes(NewUserSignIn)) {
      return null;
    }

    return (
      <FormSection theme={theme}>
        <SectionBody theme={theme}>
          <InputRow
            autoFocus
            placeholder={I18n.get('First Name')}
            theme={theme}
            key="firstName"
            name="firstName"
            onChange={this.handleInputChange}
          />
          <InputRow
            placeholder={I18n.get('Last Name')}
            theme={theme}
            key="lastName"
            name="lastName"
            onChange={this.handleInputChange}
          />
          <InputRow
            placeholder={I18n.get('Company Name')}
            theme={theme}
            key="companyName"
            name="companyName"
            onChange={this.handleInputChange}
          />
          <InputRow
            placeholder={I18n.get('Email')}
            theme={theme}
            key="email"
            name="email"
            onChange={this.handleInputChange}
          />
          <InputRow
            placeholder={I18n.get('Password')}
            theme={theme}
            type="password"
            key="password"
            name="password"
            onChange={this.handleInputChange}
          />
          <InputRow
            placeholder={I18n.get('Confirm Password')}
            theme={theme}
            type="password"
            key="confirmPassword"
            name="confirmPassword"
            onChange={this.handleInputChange}
          />
          <MessageRow theme={theme}>
            By clicking &quot;Sign Up&quot; you indicate that you have read and
            agree to {"Lightout's"}{' '}
            <a
              target="_blank"
              href={TermsAndConditionsUrl}
              rel="noopener noreferrer"
            >
              Terms of Use
            </a>{' '}
            and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={PrivacyPolicyUrl}
            >
              Privacy Policy
            </a>
            .
          </MessageRow>
          <ButtonRow onClick={this.signUp} theme={theme}>
            {I18n.get('Sign Up')}
          </ButtonRow>
          <ActionRow theme={theme} onClick={this.props.openSignInModal}>
            <Link theme={theme}>Sign In</Link>
          </ActionRow>
        </SectionBody>
      </FormSection>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  openSignInModal: () => dispatch(openAuthModal(AUTH_STATES.SIGN_IN)),
});

export default connect(
  () => ({}),
  mapDispatchToProps,
)(NewUserSignIn);
