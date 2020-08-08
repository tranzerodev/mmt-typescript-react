import React from 'react';
import { SignIn } from 'aws-amplify-react';
import { Spinner } from '../Loading';
import { AUTH_STATES } from '../../constants/authConsts';

class AutoSignIn extends SignIn {
  _validAuthStates = [AUTH_STATES.SIGNED_UP];

  // override on key down so it doesn't try to login on enter
  onKeyDown = () => {};

  componentDidUpdate(prevProps) {
    const { authState, authData } = this.props;
    const validAuthState =
      prevProps.authState !== authState && authState === AUTH_STATES.SIGNED_UP;
    const validAuthData = authData && authData.username && authData.password;
    if (validAuthState && validAuthData) {
      this.inputs = authData;
      this.signIn();
    }
  }

  showComponent = theme => (
    <div style={theme.loadingContainer}>
      <Spinner />
    </div>
  );
}

export default AutoSignIn;
