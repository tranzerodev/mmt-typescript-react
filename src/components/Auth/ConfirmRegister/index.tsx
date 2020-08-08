import React from 'react';
import { Auth, I18n } from 'aws-amplify';
import { ConfirmSignUp, ConfirmSignUpProps } from 'aws-amplify-react';
import {
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/styles';
import Button from '../../Button';
import { AUTH_STATES } from '../../../constants/authConsts';
import history from '../../../history';
import portalConfig from '../../../portalConfig';
import confirmSignInStyles from './styles';
import StringUtils from '../../../utils/StringUtils';

const styles = () => ({
  ...confirmSignInStyles,
});

const schema = Yup.object().shape({
  username: Yup.string()
    .max(64)
    .required('Account is required'),
  code: Yup.string()
    .max(64)
    .required('Code is required'),
});

class ConfirmRegister extends ConfirmSignUp {
  constructor(props: ConfirmSignUpProps) {
    super(props);
    this.state = {
      isConfirmSignUpLoading: false,
      errorMessage: 'One of the fields filled incorrectly.',
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
    this.changeState(AUTH_STATES.CONFIRM_SIGN_UP);
  }

  showComponent() {
    const { classes } = this.props;
    const usernameFromAuth = this.usernameFromAuthData();

    return (
      <Box className={classes.root}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <Typography gutterBottom variant="h2">
              Complete the registration on {portalConfig.Company}
            </Typography>
            <Formik
              initialValues={{
                username: usernameFromAuth || '',
                code: '',
              }}
              validationSchema={schema}
              onSubmit={async (values, { setStatus, setErrors }) => {
                try {
                  this.setState({ isConfirmSignUpLoading: true });
                  const username =
                    this.usernameFromAuthData() || values.username;
                  await Auth.confirmSignUp(username, values.code);
                  // will need this code when confirm sign up backend will be working
                  // this.setState({ isConfirmSignUpLoading: false });
                  // this.navigate('/');
                } catch (error) {
                  setStatus({ success: false });
                  setErrors({
                    username:
                      error && error.message
                        ? error.message
                        : this.state.errorMessage,
                    code:
                      error && error.message
                        ? error.message
                        : this.state.errorMessage,
                  });
                  this.setState({ isConfirmSignUpLoading: false });
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
                  className={classes.confirmForm}
                  onSubmit={handleSubmit}
                >
                  <Box className={classes.fields}>
                    {usernameFromAuth ? (
                      <Typography variant="subtitle1">
                        Enter the verification code sent to your email
                      </Typography>
                    ) : (
                      <TextField
                        fullWidth
                        type="text"
                        key="username"
                        name="username"
                        margin="normal"
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={this.onUsernameChange}
                        value={StringUtils.RemoveSpaceFromString(
                          values.username,
                        )}
                        label={I18n.get('Username')}
                        error={Boolean(touched.username && errors.username)}
                        helperText={touched.username && errors.username}
                        autoComplete="off"
                      />
                    )}
                    <TextField
                      fullWidth
                      type="text"
                      key="code"
                      name="code"
                      margin="normal"
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.code}
                      label={I18n.get('Code')}
                      error={Boolean(touched.code && errors.code)}
                      helperText={touched.code && errors.code}
                      autoComplete="off"
                    />
                  </Box>
                  <Button
                    htmlId="cofirm-button"
                    type="submit"
                    color="primary"
                    variant="contained"
                    buttonWrapperClasses={classes.buttonWrapper}
                    className={classes.submitButton}
                    isLoading={this.state.isConfirmSignUpLoading}
                  >
                    {I18n.get('Confirm')}
                  </Button>
                </form>
              )}
            </Formik>
            <Divider className={classes.divider} />
            <Box className={classes.navigationActionsContainer}>
              <Box className={classes.link}>
                <Box onClick={this.resend}>{I18n.get('Resend code')}</Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }
}

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default withStyles(styles)(ConfirmRegister);
