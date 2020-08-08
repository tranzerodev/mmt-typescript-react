import React from 'react';
import { I18n } from 'aws-amplify';
import { SignIn, SignInProps } from 'aws-amplify-react';
import {
  TextField,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/styles';
import LockIcon from '@material-ui/icons/Lock';
import Button from '../../Button';
import { AUTH_STATES } from '../../../constants/authConsts';
import history from '../../../history';
import portalConfig from '../../../portalConfig';
import loginStyles from './styles';
import { REGISTER_PAGE, FORGOT_PASSWORD_PAGE } from '../../../constants';
import StringUtils from '../../../utils/StringUtils';

const styles = () => ({
  ...loginStyles,
});

const schema = Yup.object().shape({
  username: Yup.string()
    .max(64)
    .required('Account is required'),
  password: Yup.string()
    .max(64)
    .required('Password is required'),
});

class Login extends SignIn {
  constructor(props: SignInProps) {
    super(props);
    this.state = {
      isSignInLoading: false,
    };
  }

  navigate = (path: string) => {
    /* eslint-disable @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    history.push(path);
  };

  onUsernameChange = (username: React.ChangeEvent<HTMLInputElement>) => {
    /* eslint-disable no-param-reassign */
    username.target.value = StringUtils.RemoveSpaceFromString(
      username.target.value,
    );
    this.handleInputChange(username);
  };

  componentDidMount() {
    this.changeState(AUTH_STATES.SIGN_IN);
  }

  showComponent() {
    const { classes } = this.props;

    return (
      <Box className={classes.root}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <LockIcon className={classes.icon} />
            <Typography gutterBottom variant="h2">
              Sign in
            </Typography>
            <Typography variant="subtitle1">
              Sign in on {portalConfig.Company}
            </Typography>
            <Formik
              initialValues={{
                username: '',
                password: '',
              }}
              validationSchema={schema}
              onSubmit={async (values, { setStatus, resetForm }) => {
                try {
                  this.setState({ isSignInLoading: true });
                  await this.signIn();
                  this.setState({ isSignInLoading: false });
                  resetForm();
                } catch (error) {
                  setStatus({ success: false });
                  this.setState({ isSignInLoading: false });
                  resetForm();
                }
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values,
              }) => (
                <form
                  noValidate
                  className={classes.loginForm}
                  onSubmit={handleSubmit}
                >
                  <Box className={classes.fields}>
                    <TextField
                      id="login-username"
                      autoFocus
                      fullWidth
                      type="text"
                      key="username"
                      name="username"
                      margin="normal"
                      variant="outlined"
                      onBlur={handleBlur}
                      onInput={handleChange}
                      onChange={this.onUsernameChange}
                      value={StringUtils.RemoveSpaceFromString(values.username)}
                      label={I18n.get('Email address')}
                      error={Boolean(touched.username && errors.username)}
                      helperText={touched.username && errors.username}
                      autoComplete="off"
                    />
                    <TextField
                      id="login-password"
                      fullWidth
                      type="password"
                      key="password"
                      name="password"
                      margin="normal"
                      variant="outlined"
                      onBlur={handleBlur}
                      onInput={handleChange}
                      onChange={this.handleInputChange}
                      value={values.password}
                      label={I18n.get('Password')}
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                      autoComplete="off"
                    />
                  </Box>
                  <Button
                    type="submit"
                    htmlId="login-signIn"
                    color="primary"
                    variant="contained"
                    buttonWrapperClasses={classes.buttonWrapper}
                    className={classes.submitButton}
                    isLoading={this.state.isSignInLoading}
                  >
                    {I18n.get('Sign in')}
                  </Button>
                </form>
              )}
            </Formik>
            <Divider className={classes.divider} />
            <Box className={classes.navigationActionsContainer}>
              <Box className={classes.link}>
                <Button
                  htmlId="login-forgot-password"
                  onClick={() => this.navigate(FORGOT_PASSWORD_PAGE)}
                >
                  {I18n.get('Forgot password')}
                </Button>
              </Box>
              <Box className={classes.link}>
                <Button
                  htmlId="login-signUp"
                  onClick={() => this.navigate(REGISTER_PAGE)}
                >
                  {I18n.get('Sign up')}
                </Button>
              </Box>
            </Box>
          </CardContent>
          <CardMedia
            className={classes.media}
            image={portalConfig.assets.authImage.signInUrl}
            style={portalConfig.assets.authImage.signInStyle}
            title="Cover"
          />
        </Card>
      </Box>
    );
  }
}

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default withStyles(styles)(Login);
