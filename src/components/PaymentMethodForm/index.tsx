import React from 'react';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import {
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  makeStyles,
  createStyles,
  FormHelperText,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FormHeader from '../Forms/FormHeader';
import { Address } from '../../constants/dataTypes';
import { RootState } from '../../store/reduxTypes';
import { PaymentInfo } from '../../store/settings/types';
import { UpdatePaymentInfo } from '../../store/settings/actions';

const useStyles = makeStyles(theme =>
  createStyles({
    cardContainer: {
      borderRadius: theme.shape.borderRadius,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.23)',
      padding: '18.5px 14px',
      '& fieldset': {},
    },
    cardContainerFocused: {
      borderColor: theme.palette.primary.main,
    },
  }),
);

interface PaymentMethodFormProps {
  title?: string;
  submitPosition: 'header' | 'bottom';
}

interface PaymentState {
  loading: boolean;
  isUpdating: boolean;
  updatingError: string;
  paymentInfo: PaymentInfo;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  title = 'Payment Method',
  submitPosition,
}) => {
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();
  const disaptch = useDispatch();
  const { loading, isUpdating, updatingError, paymentInfo } = useSelector<
    RootState,
    PaymentState
  >(state => ({
    loading: state.settings.loading,
    isUpdating: state.settings.updatingPayment,
    updatingError: state.settings.updatingPaymentError,
    paymentInfo: state.settings.paymentInfo,
  }));

  const { id: paymentId, address: paymentAddress, subscriptionId } =
    paymentInfo || {};
  /* eslint-disable @typescript-eslint/camelcase */
  const { line1, line2, city, state, postal_code, country } =
    paymentAddress || {};

  const [isCardComplete, setIsCardComplete] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleCardChanged = (event: StripeCardElementChangeEvent) => {
    setIsCardComplete(event.complete && !event.error);
    if (event.error) {
      setErrorMessage(event.error.message);
    } else {
      setErrorMessage('');
    }
  };

  const handleSave = async (values: Address) => {
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    let errorMsg;
    try {
      const result = await stripe.createToken(cardElement);
      if (result.error) {
        errorMsg = result.error.message;
      } else if (result.token) {
        disaptch(UpdatePaymentInfo(result.token.id, paymentId, values));
      } else {
        errorMsg = 'Invalid card information. Cannot be saved';
      }
    } catch (err) {
      errorMsg = err.message;
    }
    setErrorMessage(errorMsg);
  };

  const cardOptions = {
    hidePostalCode: true,
    classes: {
      focus: classes.cardContainerFocused,
    },
  };

  const cardError = errorMessage || updatingError;

  const renderFormGrid = ({
    errors,
    handleBlur,
    handleChange,
    touched,
    values,
  }: FormikProps<Address>) => {
    if (loading) {
      return <Skeleton variant="text" />;
    }
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            error={Boolean(touched.line1 && errors.line1)}
            fullWidth
            helperText={touched.line1 && errors.line1}
            label="Street Address"
            name="line1"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.line1}
            variant="outlined"
            placeholder="185 Berry Street"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={Boolean(touched.line2 && errors.line2)}
            fullWidth
            helperText={touched.line2 && errors.line2}
            label="Address Line 2"
            name="line2"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.line2}
            variant="outlined"
            placeholder="Suite 550"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            error={Boolean(touched.city && errors.city)}
            fullWidth
            helperText={touched.city && errors.city}
            label="City"
            name="city"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.city}
            variant="outlined"
            placeholder="San Francisco"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            error={Boolean(touched.state && errors.state)}
            fullWidth
            helperText={touched.state && errors.state}
            label="State"
            name="state"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.state}
            variant="outlined"
            placeholder="CA"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            error={Boolean(touched.postal_code && errors.postal_code)}
            fullWidth
            helperText={touched.postal_code && errors.postal_code}
            label="ZIP"
            name="postal_code"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.postal_code}
            variant="outlined"
            placeholder="94107"
          />
        </Grid>
        <Grid item xs={6}>
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
          <CardElement
            className={classes.cardContainer}
            options={cardOptions}
            onChange={handleCardChanged}
          />
          <FormHelperText>{cardError}</FormHelperText>
        </Grid>
      </Grid>
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        line1: line1 || '',
        line2: line2 || '',
        city: city || '',
        state: state || '',
        /* eslint-disable @typescript-eslint/camelcase */
        postal_code: postal_code || '',
        country: country || '',
      }}
      validationSchema={Yup.object().shape({
        line1: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        state: Yup.string().required('Required'),
        // eslint-disable-next-line @typescript-eslint/camelcase
        postal_code: Yup.string()
          .min(5, 'Must be at least 5 characters')
          .required('Required'),
        country: Yup.string().required('Required'),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Make API request
          await handleSave(values);
          setStatus({ success: true });
          setSubmitting(false);
        } catch (error) {
          setStatus({ success: false });
          setErrors(error);
          setSubmitting(false);
        }
      }}
    >
      {formProps => (
        <Card>
          <form onSubmit={formProps.handleSubmit}>
            <FormHeader
              title={title}
              includeSubmit={Boolean(
                !loading && !subscriptionId && submitPosition === 'header',
              )}
              submitEnabled={
                !formProps.isSubmitting && !isUpdating && isCardComplete
              }
            />
            <Divider />
            <CardContent>
              {subscriptionId ? (
                <Grid container direction="row" alignItems="center" spacing={1}>
                  <Grid item>
                    <CheckCircleIcon />
                  </Grid>
                  <Grid item>Your payment information is setup.</Grid>
                </Grid>
              ) : (
                renderFormGrid(formProps)
              )}
            </CardContent>
          </form>
        </Card>
      )}
    </Formik>
  );
};

export default PaymentMethodForm;
