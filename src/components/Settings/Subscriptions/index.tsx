import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import PaymentMethodForm from '../../PaymentMethodForm';
import { InvoicesTable } from './InvoicesTable';
import { StripeInvoice } from '../../../constants/dataTypes';
import { RootState } from '../../../store/reduxTypes';

interface InvoicesState {
  loaded: boolean;
  items: StripeInvoice[];
}

export const Subscriptions: React.FC = () => {
  const { loaded, items } = useSelector<RootState, InvoicesState>(state => ({
    loaded: state.settings.loaded,
    items: state.settings.invoices,
  }));

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <PaymentMethodForm title="Payment Method" submitPosition="header" />
      </Grid>
      <Grid item xs={12}>
        <InvoicesTable Invoices={loaded ? items : undefined} />
      </Grid>
    </Grid>
  );
};
