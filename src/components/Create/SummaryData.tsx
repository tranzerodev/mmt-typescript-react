import React from 'react';
import { Grid, styled, Typography } from '@material-ui/core';
import { SummaryDataType } from './CreateTypes';
import { abbreviateNumber } from '../../data/utils/formatUtils';

const BoldLabel = styled(Typography)({
  fontWeight: 'bold',
});

interface SummaryDataProps {
  summaryData: SummaryDataType;
}
const SummaryData: React.FC<SummaryDataProps> = ({ summaryData }) => (
  <Grid container>
    <Grid item xs={6}>
      <br />
      <BoldLabel variant="h5">Endpoints</BoldLabel>
      <br />
      <BoldLabel variant="h5">Impressions</BoldLabel>
      <br />
      <BoldLabel variant="h5">CPH (Cost Per Hour)</BoldLabel>
      <br />
      <BoldLabel variant="h5">CPM (Cost Per Thousand Impressions)</BoldLabel>
    </Grid>
    <Grid item xs={6}>
      <br />
      <Typography variant="h5">{summaryData.numEndpoints}</Typography>
      <br />
      <Typography variant="h5">
        {abbreviateNumber(summaryData.impressions)}
      </Typography>
      <br />
      <Typography variant="h5">{`$${summaryData.CPH.toFixed(2)}`}</Typography>
      <br />
      <Typography variant="h5">{`$${summaryData.CPM.toFixed(2)}`}</Typography>
    </Grid>
  </Grid>
);

export default SummaryData;
