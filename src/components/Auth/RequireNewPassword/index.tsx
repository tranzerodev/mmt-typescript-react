import React from 'react';
import { I18n } from 'aws-amplify';
import {
  RequireNewPassword as AwsRequireNewPassword,
  ReqiureNewPasswordProps,
} from 'aws-amplify-react';
import {
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
  Container,
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/styles';
import Button from '../../Button';
import { AUTH_STATES } from '../../../constants/authConsts';
import history from '../../../history';
import portalConfig from '../../../portalConfig';
import requireNewPasswordStyles from './styles';

const styles = () => ({
  ...requireNewPasswordStyles,
});

const schema = Yup.object().shape({
  newPassword: Yup.string()
    .max(64)
    .min(6)
    .matches(/[a-z]/, 'at least one lowercase char')
    .matches(/[A-Z]/, 'at least one uppercase char')
    .matches(/[0-9]+/, 'at least one number.')
    .required('Password is required'),
  password: Yup.string()
    .min(6)
    .required('Confirm password is required')
    .when('newPassword', {
      is: val => !!(val && val.length > 0),
      then: Yup.string().oneOf(
        [Yup.ref('newPassword')],
        'Your passwords do not match',
      ),
    }),
});

class RequireNewPassword extends AwsRequireNewPassword {
  constructor(props: ReqiureNewPasswordProps) {
    super(props);
    this.state = {
      isConfirmNewPasswordLoading: false,
      errorMessage: 'The entered passwords do not match.',
    };
  }

  navigate = (path: string) => {
    /* eslint-disable @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    history.push(path);
  };

  componentDidMount() {
    this.changeState(AUTH_STATES.REQUIRE_NEW_PASSWORD, 'requireNewPassword');
  }

  showComponent() {
    const { classes } = this.props;

    return (
      <Box className={classes.root}>
        <Container maxWidth="sm" className={classes.container}>
          <Card className={classes.card}>
            <CardContent className={classes.content}>
              <Typography gutterBottom variant="h2">
                Complete the login on {portalConfig.Company}
              </Typography>
              <Formik
                initialValues={{
                  newPassword: '',
                  password: '',
                }}
                validationSchema={schema}
                onSubmit={async (values, { setStatus, setErrors }) => {
                  try {
                    this.setState({ isConfirmNewPasswordLoading: true });
                    await this.change();
                  } catch (error) {
                    setStatus({ success: false });
                    setErrors({
                      newPassword: this.state.errorMessage,
                      password: this.state.errorMessage,
                    });
                    this.setState({ isConfirmNewPasswordLoading: false });
                  }
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleSubmit,
                  touched,
                  handleChange,
                }) => (
                  <form
                    noValidate
                    className={classes.confirmForm}
                    onSubmit={handleSubmit}
                  >
                    <Box className={classes.fields}>
                      <TextField
                        fullWidth
                        type="password"
                        key="newPassword"
                        name="newPassword"
                        margin="normal"
                        variant="outlined"
                        onBlur={handleBlur}
                        onInput={handleChange}
                        onChange={this.handleInputChange}
                        label={I18n.get('New Password')}
                        error={Boolean(
                          touched.newPassword && errors.newPassword,
                        )}
                        helperText={touched.newPassword && errors.newPassword}
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
                        label={I18n.get('Confirm Password')}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                        autoComplete="off"
                      />
                    </Box>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      buttonWrapperClasses={classes.buttonWrapper}
                      className={classes.submitButton}
                      isLoading={this.state.isConfirmNewPasswordLoading}
                    >
                      {I18n.get('Change')}
                    </Button>
                  </form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }
}

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default withStyles(styles)(RequireNewPassword);
