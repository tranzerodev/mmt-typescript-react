import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  NoSsr,
  CircularProgress,
} from '@material-ui/core';
import Loadable from 'react-loadable';
import { Skeleton } from '@material-ui/lab';
import { RootState } from '../../../store/reduxTypes';
import { UserState as User } from '../../../store/user/types';
import Button from '../../Button';

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import { updateUserAttributes } from '../../../store/user/actions';

interface ProfileFormProps {
  className?: string;
}

interface Model {
  user: User;
}

interface LoadingComponentProps {
  isLoading?: boolean;
  pastDelay?: boolean;
  timedOut?: boolean;
  error?: any;
  retry?: () => void;
}

interface PhoneNumberInputValueProps {
  countryCode: string;
  dialCode: string;
  name: string;
}

const useStyles = makeStyles(() => ({
  root: {},
}));

export const ProfileForm: React.FC<ProfileFormProps> = ({
  className,
  ...rest
}) => {
  let phoneNumberStaged = '';

  const [userPhoneNumber, setUserPhoneNumber] = useState<string>(
    phoneNumberStaged,
  );
  const classes = useStyles();
  const dispatch = useDispatch();

  const stateModel = useSelector<RootState, Model>(state => ({
    user: state.user,
  }));

  const { instance, updatingAttributes } = stateModel.user;
  const { attributes } = instance || {};
  /* eslint-disable @typescript-eslint/camelcase */
  const { given_name, family_name, email, phone_number, address } =
    attributes || {};
  const addressParse = (address && JSON.parse(address)) || {};

  const loading = (_: LoadingComponentProps) => <CircularProgress />;

  const MuiPhoneNumber: any = Loadable({
    loader: () => import('material-ui-phone-number'),
    loading,
  });

  const onPhoneNumberChange = (
    phone: string,
    val: PhoneNumberInputValueProps,
  ) => {
    const phoneStaged = phone.replace(/[-()\s]/g, '');
    phoneNumberStaged = phoneStaged;
  };

  const wrapSkeleton = (returnValue: any) => {
    if (updatingAttributes) {
      return <Skeleton variant="rect" height={50} />;
    }

    return returnValue;
  };

  useEffect(() => {
    setUserPhoneNumber(phone_number);
  }, [phone_number]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        email: email || '',
        given_name: given_name || '',
        family_name: family_name || '',
        phone_number: phone_number || '',
        country: addressParse.country || '',
        state: addressParse.state || '',
      }}
      validationSchema={Yup.object().shape({
        country: Yup.string()
          .length(2, 'Two-letter country code (e.g., US or CA).')
          .required('Required'),
        state: Yup.string()
          .max(255)
          .required('State is required'),
        email: Yup.string().max(255),
        given_name: Yup.string()
          .max(255)
          .required('First name is required'),
        family_name: Yup.string()
          .max(255)
          .required('Last name is required'),
        phone_number: Yup.string().required('Phone number is required'),
      })}
      onSubmit={async (values, { setStatus, setSubmitting }) => {
        try {
          const params = {
            ...values,
            phone_number: phoneNumberStaged || phone_number,
            address: JSON.stringify({
              country: values.country,
              state: values.state,
            }),
          };
          delete params.email; // dont send email to update otherwise cognito will err
          delete params.country;
          delete params.state;

          dispatch(
            updateUserAttributes({
              ...params,
            }),
          );
          setStatus({ success: true });
        } catch (error) {
          setStatus({ success: false });
        } finally {
          setSubmitting(false);
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
        <form onSubmit={handleSubmit}>
          <Card className={clsx(classes.root, className)} {...rest}>
            <CardHeader title="Profile" />
            <Divider />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item md={6} xs={12}>
                  {wrapSkeleton(
                    <TextField
                      error={Boolean(touched.given_name && errors.given_name)}
                      fullWidth
                      helperText={touched.given_name && errors.given_name}
                      label="First name"
                      name="given_name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      type="given_name"
                      value={values.given_name}
                      variant="outlined"
                    />,
                  )}
                </Grid>
                <Grid item md={6} xs={12}>
                  {wrapSkeleton(
                    <TextField
                      error={Boolean(touched.family_name && errors.family_name)}
                      fullWidth
                      helperText={touched.family_name && errors.family_name}
                      label="Last name"
                      name="family_name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      type="family_name"
                      value={values.family_name}
                      variant="outlined"
                    />,
                  )}
                </Grid>
                <Grid item md={6} xs={12}>
                  {wrapSkeleton(
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label="Email address"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      type="email"
                      value={values.email}
                      variant="outlined"
                      disabled
                    />,
                  )}
                </Grid>
                <Grid item md={6} xs={12}>
                  {wrapSkeleton(
                    <NoSsr>
                      <MuiPhoneNumber
                        error={Boolean(
                          touched.phone_number && errors.phone_number,
                        )}
                        fullWidth
                        helperText={touched.phone_number && errors.phone_number}
                        defaultCountry="us"
                        label="Phone number"
                        name="phone_number"
                        value={userPhoneNumber || values.phone_number}
                        onBlur={handleBlur}
                        onChange={(
                          e: string,
                          val: PhoneNumberInputValueProps,
                        ) => onPhoneNumberChange(e, val)}
                        onInput={handleChange}
                        variant="outlined"
                        disableAreaCodes
                      />
                    </NoSsr>,
                  )}
                </Grid>
                <Grid item md={6} xs={12}>
                  {wrapSkeleton(
                    <TextField
                      error={Boolean(touched.state && errors.state)}
                      fullWidth
                      helperText={touched.state && errors.state}
                      label="State"
                      name="state"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      type="state"
                      value={values.state}
                      variant="outlined"
                    />,
                  )}
                </Grid>
                <Grid item md={6} xs={12}>
                  {wrapSkeleton(
                    <TextField
                      error={Boolean(touched.country && errors.country)}
                      fullWidth
                      helperText={touched.country && errors.country}
                      label="Country"
                      name="country"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      type="country"
                      value={values.country}
                      variant="outlined"
                    />,
                  )}
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box p={2} display="flex" justifyContent="flex-end">
              <Button
                color="primary"
                isLoading={updatingAttributes}
                type="submit"
                variant="contained"
                htmlId="submit button"
              >
                Save Changes
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};
