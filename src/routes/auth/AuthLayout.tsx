import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Container, SvgIcon } from '@material-ui/core';
import { Authenticator } from 'aws-amplify-react';
import { Home as HomeIcon } from 'react-feather';
import { Hub } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { AUTH_STATES } from '../../constants/authConsts';
import history from '../../history';
import { RouteContext, ContextProps } from '../../context';
import autoSignIn, { AutoSignInProps } from '../../utils/AutoSignIn';
import Register from '../../components/Auth/Register';
import Login from '../../components/Auth/Login';
import RequireNewPassword from '../../components/Auth/RequireNewPassword/index';
import ForgotPassword from '../../components/Auth/ForgotPassword/index';
// import ConfirmRegister from '../../components/Auth/ConfirmRegister';

import AlertSnackbar from '../../components/AlertSnackbar';
import '../../components/Layout/Layout.css';
import { resetUserLoadedAction } from '../../store/user/actions';
import { alertSnackbar, clearAlertMessage } from '../../store/ui/actions';
import Spinner from '../../components/Loading';

interface AuthStateData {
  challengeName?: string;
}

const AuthLayout: React.FC = () => {
  const [authState, setAuthState] = useState<string>('');
  const [authStateData, setAuthStateData] = useState<AuthStateData>({});
  const context: ContextProps = useContext(RouteContext);
  const { query, isMobile } = context;
  const { step } = query || '';

  const useStyles = makeStyles(theme => ({
    '@global': {
      '*': {
        margin: 0,
        padding: 0,
      },
      html: {
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
        width: '100%',
      },
      '#root': {
        height: '100%',
        width: '100%',
      },
    },
    body: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: isMobile ? '100%' : '100vh',
      backgroundColor: '#f4f6f8',
    },
    logo: {
      height: 20,
      width: 20,
      marginRight: theme.spacing(2),
    },
    spinner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButton: {},
    authWrapper: {},
  }));

  const classes = useStyles();
  const dispatch = useDispatch();

  const navigate = (path: string) => {
    dispatch(clearAlertMessage());
    /* eslint-disable @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    history.push(path);
  };

  const handleStateChange = (
    authStateValue: string,
    data: AutoSignInProps & AuthStateData,
  ) => {
    dispatch(clearAlertMessage());
    setAuthStateData(data);
    setAuthState(authStateValue);

    if (authStateValue && authStateValue === AUTH_STATES.SIGNED_UP && data) {
      Hub.remove('auth', () => '');
      autoSignIn({ ...data });
    }

    if (authStateValue && authStateValue === AUTH_STATES.SIGNED_IN) {
      dispatch(resetUserLoadedAction());
      Hub.remove('auth', () => '');
      navigate('/');
    }
  };

  const isWideContent = () => {
    if (
      (query &&
        step &&
        step !== AUTH_STATES.SIGN_IN &&
        step !== AUTH_STATES.SIGN_UP &&
        (authState !== AUTH_STATES.SIGN_IN &&
          authState !== AUTH_STATES.SIGN_UP)) ||
      (authStateData && authStateData.challengeName === 'NEW_PASSWORD_REQUIRED')
    ) {
      return false;
    }

    return true;
  };

  let authenticatorChildren = [
    <RequireNewPassword key="authNewPassword" />,
    // <ConfirmRegister key="authConfirmSignUp" />
  ];
  if (query && step === AUTH_STATES.SIGN_UP) {
    authenticatorChildren.push(<Register key="authSignUp" />);
  } else if (query && step === AUTH_STATES.FORGOT_PASSWORD) {
    authenticatorChildren.push(<ForgotPassword key="forgotPassword" />);
  } else {
    authenticatorChildren.push(<Login key="authSignIn" />);
  }

  useEffect(() => {
    // Listen for the auth errors
    // Errors come inside `data.payload.data.message`
    Hub.listen('auth', data => {
      if (
        data &&
        data.payload &&
        data.payload.data &&
        data.payload.data.message
      ) {
        // TODO: temproray solution, change error message
        const authErrorMsg =
          'PreSignUp failed with error A user with the same email address exists.';
        if (data.payload.data.message === authErrorMsg) {
          /* eslint-disable no-param-reassign */
          data.payload.data.message =
            "An account with this email already exists. If you don't remember your password try Forgot Password";
        }

        if (data.payload.event !== 'signIn_failure') {
          dispatch(clearAlertMessage());
          dispatch(alertSnackbar({ errorMessage: data.payload.data.message }));
        } else {
          dispatch(clearAlertMessage());
          dispatch(
            alertSnackbar({ errorMessage: 'Incorrect username or password.' }),
          );
        }
      }
    });

    return () => {
      Hub.remove('auth', () => '');
      authenticatorChildren = [];
    };
  }, []);

  return (
    <Box className={classes.body}>
      <Container maxWidth={isWideContent() ? 'md' : 'sm'}>
        {authState === AUTH_STATES.SIGNED_IN ||
        authState === AUTH_STATES.SIGNED_UP ? (
          <Box className={classes.spinner}>
            <Spinner />
          </Box>
        ) : (
          <Box mb={isWideContent() ? 8 : 5} display="flex" alignItems="center">
            <Button
              startIcon={
                <SvgIcon>
                  <HomeIcon />
                </SvgIcon>
              }
              className={classes.backButton}
              onClick={() => navigate('/')}
            >
              Back to home
            </Button>
          </Box>
        )}
        <Box className={classes.authWrapper}>
          <Authenticator
            hideDefault
            authState={step}
            onStateChange={(authStateValue: string, data) =>
              handleStateChange(authStateValue, data)
            }
            // hide default error notifications
            errorMessage={() => null}
          >
            {authenticatorChildren}
          </Authenticator>
        </Box>
      </Container>
      <AlertSnackbar />
    </Box>
  );
};

export default AuthLayout;
