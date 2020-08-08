import React from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  makeStyles,
  createStyles,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from '@material-ui/core';
import Button from '../../Button';
import { changeUserPassword } from '../../../store/user/actions';

interface SecurityProps {
  className?: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    divider: {
      marginTop: 15,
      marginBottom: 15,
    },
  }),
);

export const Security: React.FC<SecurityProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        oldPassword: '',
        password: '',
        passwordConfirm: '',
      }}
      validationSchema={Yup.object().shape({
        oldPassword: Yup.string().required('Old password is required'),
        password: Yup.string()
          .max(64)
          .min(6)
          .matches(/[a-z]/, 'at least one lowercase char')
          .matches(/[A-Z]/, 'at least one uppercase char')
          .matches(/[0-9]+/, 'at least one number.')
          .required('Password is required'),
        passwordConfirm: Yup.string()
          .min(6)
          .required('Confirm password is required')
          .when('password', {
            is: val => !!(val && val.length > 0),
            then: Yup.string().oneOf(
              [Yup.ref('password')],
              'Your passwords do not match',
            ),
          }),
      })}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          dispatch(
            changeUserPassword(values.oldPassword, values.passwordConfirm),
          );
          resetForm();
          setSubmitting(false);
        } catch (error) {
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card className={clsx(classes.root, className)} {...rest}>
            <CardHeader title="Change password" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.oldPassword && errors.oldPassword)}
                    fullWidth
                    helperText={touched.oldPassword && errors.oldPassword}
                    label="Old password"
                    name="oldPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.oldPassword}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label="Password"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.password}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(
                      touched.passwordConfirm && errors.passwordConfirm,
                    )}
                    fullWidth
                    helperText={
                      touched.passwordConfirm && errors.passwordConfirm
                    }
                    label="Password confirmation"
                    name="passwordConfirm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.passwordConfirm}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box p={2} display="flex" justifyContent="flex-end">
              <Button
                htmlId="changePasswordButton"
                color="primary"
                isLoading={isSubmitting}
                type="submit"
                variant="contained"
              >
                Change password
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};
