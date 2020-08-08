import React from 'react';
import { I18n } from 'aws-amplify';
import {
  ForgotPassword as AwsForgotPassword,
  ForgotPasswordProps,
} from 'aws-amplify-react';
import {
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Divider,
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/styles';
import Button from '../../Button';
import { AUTH_STATES } from '../../../constants/authConsts';
import history from '../../../history';
import requireNewPasswordStyles from './styles';
import { LOGIN_PAGE } from '../../../constants';
import StringUtils from '../../../utils/StringUtils';

const styles = () => ({
  ...requireNewPasswordStyles,
});

const accountFormSchema = Yup.object().shape({
  username: Yup.string()
    .min(1)
    .max(64)
    .required('Email is required'),
});

const confirmFormSchema = Yup.object().shape({
  code: Yup.string()
    .min(6)
    .max(64)
    .required('Code is required'),
  password: Yup.string()
    .max(64)
    .min(6)
    .matches(/[a-z]/, 'at least one lowercase char')
    .matches(/[A-Z]/, 'at least one uppercase char')
    .matches(/[0-9]+/, 'at least one number.')
    .required('Password is required'),
});

class ForgotPassword extends AwsForgotPassword {
  constructor(props: ForgotPasswordProps) {
    super(props);
    this.state = {
      isLoading: false,
      errorMessage: 'Username not found.',
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
    this.changeState(AUTH_STATES.FORGOT_PASSWORD);
  }

  showComponent() {
    const { classes, authData } = this.props;

    const ConfirmForm = (
      <Formik
        initialValues={{
          code: '',
          password: '',
        }}
        validationSchema={confirmFormSchema}
        onSubmit={async (values, { setStatus }) => {
          try {
            this.setState({ isLoading: true });
            await this.submit();
            this.setState({ isLoading: false });
          } catch (error) {
            setStatus({ success: false });
            this.setState({ isLoading: false });
          }
        }}
      >
        {({ errors, handleBlur, handleSubmit, touched, handleChange }) => (
          <form
            noValidate
            className={classes.confirmForm}
            onSubmit={handleSubmit}
          >
            <Box className={classes.fields}>
              <Box>
                <TextField
                  fullWidth
                  type="text"
                  key="code"
                  name="code"
                  margin="normal"
                  variant="outlined"
                  onBlur={handleBlur}
                  onInput={handleChange}
                  onChange={this.handleInputChange}
                  label={I18n.get('Code')}
                  error={Boolean(touched.code && errors.code)}
                  helperText={touched.code && errors.code}
                  autoComplete="off"
                />
                <TextField
                  fullWidth
                  type="password"
                  key="password"
                  name="password"
                  margin="normal"
                  variant="outlined"
                  onBlur={handleBlur}
                  onInput={handleChange}
                  onChange={this.handleInputChange}
                  label={I18n.get('New password')}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  autoComplete="off"
                />
              </Box>
            </Box>
            <Button
              htmlId="forgot-password-submit"
              type="submit"
              color="primary"
              variant="contained"
              buttonWrapperClasses={classes.buttonWrapper}
              className={classes.submitButton}
              isLoading={this.state.isLoading}
            >
              {I18n.get('Submit')}
            </Button>
            <Divider className={classes.divider} />
            <Box className={classes.navigationActionsContainer}>
              <Box className={classes.link}>
                <Button
                  htmlId="forgot-password-back"
                  onClick={() => this.navigate(LOGIN_PAGE)}
                >
                  {I18n.get('Back to sign in')}
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    );

    const AccountForm = (
      <Formik
        initialValues={{
          username: '',
        }}
        validationSchema={accountFormSchema}
        onSubmit={async (values, { setStatus, resetForm }) => {
          try {
            this.setState({ isLoading: true });
            await this.send();
            this.setState({ isLoading: false });
            resetForm();
          } catch (error) {
            setStatus({ success: false });
            this.setState({ isLoading: false });
            resetForm();
          }
        }}
      >
        {({ errors, handleBlur, handleSubmit, touched, handleChange }) => (
          <form
            noValidate
            className={classes.confirmForm}
            onSubmit={handleSubmit}
          >
            <Box className={classes.fields}>
              <Box>
                <TextField
                  fullWidth
                  type="text"
                  key="username"
                  name="username"
                  margin="normal"
                  variant="outlined"
                  onBlur={handleBlur}
                  onInput={handleChange}
                  onChange={this.onUsernameChange}
                  label={I18n.get('Enter your email')}
                  error={Boolean(touched.username && errors.username)}
                  helperText={touched.username && errors.username}
                  autoComplete="off"
                />
              </Box>
            </Box>
            <Button
              htmlId="forgot-password-send-code"
              type="submit"
              color="primary"
              variant="contained"
              buttonWrapperClasses={classes.buttonWrapper}
              className={classes.submitButton}
              isLoading={this.state.isLoading}
            >
              {I18n.get('Send code')}
            </Button>
            <Divider className={classes.divider} />
            <Box className={classes.navigationActionsContainer}>
              <Box className={classes.link}>
                <Button
                  htmlId="forgot-password-back-to-signIn"
                  onClick={() => this.navigate(LOGIN_PAGE)}
                >
                  {I18n.get('Back to sign in')}
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    );

    return (
      <Box className={classes.root}>
        <Container maxWidth="sm" className={classes.container}>
          <Card className={classes.card}>
            <CardContent className={classes.content}>
              <Typography gutterBottom variant="h2">
                Forgot password
              </Typography>
              {(this.state && this.state.delivery) ||
              (authData && authData.username)
                ? ConfirmForm
                : AccountForm}
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }
}

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default withStyles(styles)(ForgotPassword);
