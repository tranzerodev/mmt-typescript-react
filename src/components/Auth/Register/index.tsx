import React from 'react';
import { Auth, I18n } from 'aws-amplify';
import { SignUp } from 'aws-amplify-react';
import {
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  CardMedia,
  Grid,
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/styles';
import { v4 } from 'uuid';
import history from '../../../history';
import Button from '../../Button';
import { LOGIN_PAGE } from '../../../constants';
import { AUTH_STATES } from '../../../constants/authConsts';
import portalConfig from '../../../portalConfig';
import registerStyles from './styles';
import ClientsClient from '../../../clients/ClientsClient';
import StringUtils from '../../../utils/StringUtils';

const styles = () => ({
  ...registerStyles,
});

const schema = Yup.object().shape({
  firstName: Yup.string()
    .max(64)
    .required('First name is required'),
  lastName: Yup.string()
    .max(64)
    .required('Last name is required'),
  companyName: Yup.string()
    .max(100)
    .required('Company is required'),
  email: Yup.string()
    .email('Invalid email')
    .max(100)
    .required('Email is required'),
  password: Yup.string()
    .max(64)
    .min(6)
    .matches(/[a-z]/, 'at least one lowercase char')
    .matches(/[A-Z]/, 'at least one uppercase char')
    .matches(/[0-9]+/, 'at least one number.')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .min(6)
    .required('Confirm password is required')
    .when('password', {
      is: val => !!(val && val.length > 0),
      then: Yup.string().oneOf(
        [Yup.ref('password')],
        'Your passwords do not match',
      ),
    }),
  // policy: Yup.boolean().oneOf([true], 'This field must be checked'),
});

class Register extends SignUp {
  constructor(props: any) {
    super(props);
    this.state = {
      isSignUpLoading: false,
      termsAndConditionsUrl: 'advertising-terms-and-conditions.html',
      privacyPolicyUrl: 'privacypolicy.html',
    };
  }

  handleForgotPassword = () => {
    this.changeState(AUTH_STATES.FORGOT_PASSWORD);
  };

  navigate = (path: string) => {
    /* eslint-disable @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    history.push(path);
  };

  componentDidMount() {
    this.changeState(AUTH_STATES.SIGN_UP);
  }

  showComponent() {
    const { classes } = this.props;

    return (
      <Box className={classes.root}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <Typography gutterBottom variant="h2" color="textPrimary">
              {I18n.get('Sign up')}
            </Typography>
            <Typography variant="subtitle1">
              {I18n.get('Sign up on ')}
              {portalConfig.Company}
            </Typography>
            <Formik
              validationSchema={schema}
              initialValues={{
                firstName: '',
                lastName: '',
                password: '',
                companyName: '',
                email: '',
                confirmPassword: '',
                // policy: false,
              }}
              onSubmit={async (values, { setStatus }) => {
                try {
                  this.setState({ isSignUpLoading: true });
                  const username = v4();
                  await Auth.signUp({
                    username,
                    password: values.password,
                    attributes: {
                      email: values.email,
                      /* eslint-disable @typescript-eslint/camelcase */
                      phone_number: `+10000000000`,
                      /* eslint-disable @typescript-eslint/camelcase */
                      given_name: values.firstName,
                      /* eslint-disable @typescript-eslint/camelcase */
                      family_name: values.lastName,
                      'custom:companyName': values.companyName,
                    },
                    clientMetadata: {
                      businessMode: portalConfig.businessMode,
                      portal: portalConfig.portalHeader,
                    },
                  });
                  await ClientsClient.newClientSignUp(username);
                  await this.changeState(AUTH_STATES.SIGNED_UP, {
                    username,
                    password: values.password,
                  });
                } catch (error) {
                  setStatus({ success: false });
                  this.setState({ isSignUpLoading: false });
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
                  className={classes.form}
                  onSubmit={handleSubmit}
                >
                  <Box className={classes.fields}>
                    <Grid
                      container
                      spacing={3}
                      className={classes.gridContainer}
                    >
                      <Grid item sm={6} xs={12}>
                        <TextField
                          fullWidth
                          type="text"
                          key="firstName"
                          name="firstName"
                          margin="normal"
                          variant="outlined"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          label={I18n.get('First name')}
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                          autoComplete="off"
                        />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <TextField
                          fullWidth
                          type="text"
                          key="lastName"
                          name="lastName"
                          margin="normal"
                          variant="outlined"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.lastName}
                          label={I18n.get('Last name')}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                          autoComplete="off"
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      fullWidth
                      type="text"
                      key="email"
                      name="email"
                      margin="normal"
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={StringUtils.RemoveSpaceFromString(values.email)}
                      label={I18n.get('Email')}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                      autoComplete="off"
                    />
                    <TextField
                      fullWidth
                      type="text"
                      key="companyName"
                      name="companyName"
                      margin="normal"
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.companyName}
                      label={I18n.get('Company name')}
                      error={Boolean(touched.companyName && errors.companyName)}
                      helperText={touched.companyName && errors.companyName}
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
                      onChange={handleChange}
                      value={values.password}
                      label={I18n.get('Password')}
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                      autoComplete="off"
                    />
                    <TextField
                      fullWidth
                      type="password"
                      key="confirmPassword"
                      name="confirmPassword"
                      margin="normal"
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.confirmPassword}
                      label={I18n.get('Confirm password')}
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword,
                      )}
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                      autoComplete="off"
                    />
                    {/** Privacy Policy has been commented, just uncomment when we will need it */}
                    {/* <Box
                        alignItems="center"
                        display="flex"
                        className={classes.checkboxWrapper}
                      >
                        <Checkbox
                          className={classes.checkbox}
                          checked={values.policy}
                          name="policy"
                          size="medium"
                          color="primary"
                          onChange={handleChange}
                        />
                        <Typography variant="body2" color="textSecondary">
                          I have read the{' '}
                          <Link
                            component="a"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={this.state.termsAndConditionsUrl}
                          >
                            Terms of Use
                          </Link>{' '}
                          and{' '}
                          <Link
                            component="a"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={this.state.privacyPolicyUrl}
                          >
                            Privacy Policy
                          </Link>
                          .
                        </Typography>
                      </Box>
                      <Box className={classes.policyError}>
                        {Boolean(touched.policy && errors.policy) && (
                          <FormHelperText error>{errors.policy}</FormHelperText>
                        )}
                      </Box> */}
                  </Box>
                  <Button
                    htmlId="register-create-account"
                    type="submit"
                    color="primary"
                    variant="contained"
                    buttonWrapperClasses={classes.buttonWrapper}
                    className={classes.submitButton}
                    isLoading={this.state.isSignUpLoading}
                  >
                    {I18n.get('Create account')}
                  </Button>
                </form>
              )}
            </Formik>
            <Divider className={classes.divider} />
            <Box className={classes.link}>
              <Button
                htmlId="register-have-account"
                onClick={() => this.navigate(LOGIN_PAGE)}
              >
                {I18n.get('Have an account?')}
              </Button>
            </Box>
          </CardContent>
          <CardMedia
            className={classes.media}
            image={portalConfig.assets.authImage.signUpUrl}
            style={portalConfig.assets.authImage.signUpStyle}
            title="Cover"
          />
        </Card>
      </Box>
    );
  }
}

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default withStyles(styles)(Register);
