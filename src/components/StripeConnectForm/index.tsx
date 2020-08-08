import React from 'react';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Button,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { StripeLogo } from '../Icons';
import FormHeader from '../Forms/FormHeader';
import { RootState } from '../../store/reduxTypes';
import { CognitoUser } from '../../store/user/types';
import { PaymentInfo } from '../../store/settings/types';
import UsersClient from '../../clients/UsersClient';

interface PaymentState {
  loading: boolean;
  cognitoUser: CognitoUser | null;
  paymentInfo: PaymentInfo;
}

interface StripeConnectForm {
  businessName: string;
  country: string;
}

const StripeConnectForm: React.FC = () => {
  const { loading, cognitoUser, paymentInfo } = useSelector<
    RootState,
    PaymentState
  >(state => ({
    loading: state.settings.loading,
    cognitoUser: state.user.instance,
    paymentInfo: state.settings.paymentInfo,
  }));

  const { id, address: paymentAddress, businessName, accountId } =
    paymentInfo || {};
  /* eslint-disable @typescript-eslint/camelcase */
  const { country } = paymentAddress || {};

  const renderFormGrid = ({
    errors,
    handleBlur,
    handleChange,
    touched,
    values,
  }: FormikProps<StripeConnectForm>) => {
    if (loading) {
      return <Skeleton variant="text" />;
    }
    return (
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            error={Boolean(touched.businessName && errors.businessName)}
            fullWidth
            helperText={touched.businessName && errors.businessName}
            label="Registered Company Name"
            name="businessName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.businessName}
            variant="outlined"
            placeholder="Infinity & Beyond LLC"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            error={Boolean(touched.country && errors.country)}
            fullWidth
            helperText={touched.country && errors.country}
            label="Country"
            name="country"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.country}
            variant="outlined"
            placeholder="US"
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Typography>
                We use Stripe to make sure you get paid on time and to keep your
                personal bank and details secure. Click{' '}
                <strong>Save and continue</strong> to set up your payments on
                Stripe.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <StripeLogo style={{ fontSize: 80 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        businessName: businessName || '',
        country: country || '',
      }}
      validationSchema={Yup.object().shape({
        businessName: Yup.string().required('Required'),
        country: Yup.string()
          .length(2, 'Two-letter country code (e.g., US or CA).')
          .required('Required'),
      })}
      onSubmit={async values => {
        if (!cognitoUser) {
          return;
        }

        const stripeOauthUrl = await UsersClient.GetStripeOauthUrl({
          id,
          email: cognitoUser.attributes.email,
          ...values,
        });
        window.location.assign(stripeOauthUrl.data);
      }}
    >
      {formProps => (
        <Card>
          <form onSubmit={formProps.handleSubmit}>
            <FormHeader
              title="Bank Information"
              includeSubmit={false}
              submitEnabled={false}
            />
            <Divider />
            <CardContent>
              {accountId ? (
                <Grid container direction="row" alignItems="center" spacing={1}>
                  <Grid item>
                    <CheckCircleIcon />
                  </Grid>
                  <Grid item>
                    Your bank information is setup. You are ready to bill your
                    clients and receive payments.
                  </Grid>
                </Grid>
              ) : (
                renderFormGrid(formProps)
              )}
            </CardContent>
            {accountId ? null : (
              <>
                <Divider />
                <Box p={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    color="primary"
                  >
                    Save and Continue
                  </Button>
                </Box>
              </>
            )}
          </form>
        </Card>
      )}
    </Formik>
  );
};

export default StripeConnectForm;
