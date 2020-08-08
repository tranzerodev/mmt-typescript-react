import React from 'react';
import { Grid } from '@material-ui/core';
import StripeConnectForm from '../../StripeConnectForm';

export const Banking: React.FC = () => (
  <Grid container>
    <Grid item xs={6}>
      <StripeConnectForm />
    </Grid>
  </Grid>
);
