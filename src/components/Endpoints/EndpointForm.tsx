import React, { useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  makeStyles,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import * as ReduxType from '../../store/reduxTypes';

import DateRangePicker from '../Create/DateRangePicker';
import { EndpointFormValueType } from '../../store/endpoints/types';
import { Options } from '../../store/options/types';
import ProductsSelect from '../Create/ProductsSelect';
import DmasSelect from '../Create/DmasSelect';

const dateFormat = 'MM/DD/YYYY';

const useStyles = makeStyles(theme => ({
  root: {},
  checkboxContainer: { marginLeft: 0 },
  confirmButton: {
    marginLeft: theme.spacing(2),
  },
}));

export type EndpointFormProps = {
  formValue: EndpointFormValueType;
  handleSubmit: (data: EndpointFormValueType) => void;
  onCancel: () => void;
};

const EndpointForm: React.FC<EndpointFormProps> = props => {
  const { handleSubmit, onCancel, formValue } = props;
  const { campaignOptions } = useSelector<ReduxType.RootState>(state => ({
    campaignOptions: state.options.data,
  }));
  const classes = useStyles();
  const [formValues, setFromValues] = useState<EndpointFormValueType>({
    endpointType: formValue.endpointType,
    DMA: formValue.DMA,
    isMoving: formValue.isMoving || false,
    latitude: formValue.latitude,
    longitude: formValue.longitude,
    groupSize: formValue.groupSize,
    hourlyImpressions: formValue.hourlyImpressions,
    dailyUTCStartTime: formValue.dailyUTCStartTime,
    dailyUTCendTime: formValue.dailyUTCendTime,
    dailyHours: formValue.dailyHours,
  });
  const { dmas: dmaOptions = [], types: productOptions = [] } =
    campaignOptions || {};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleArraySelectChange = (value: EndpointFormValueType) => {
    setFromValues({
      ...formValues,
      ...value,
    });
  };

  const handleDateChange = (value: EndpointFormValueType) => {
    handleArraySelectChange(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(formValues);
  };
  return (
    <form onSubmit={onSubmit}>
      <Box p={3}>
        <Typography
          align="center"
          gutterBottom
          variant="h3"
          color="textPrimary"
        >
          {formValue.externalID ? 'Update' : 'New'} Endpoint
        </Typography>
      </Box>

      <Box p={3}>
        <Box mb={2}>
          <ProductsSelect
            productOptions={productOptions}
            values={formValues.endpointType || []}
            fieldName="endpointType"
            isMoving={formValues.isMoving}
            onUpdate={handleArraySelectChange}
          />
        </Box>
        <Box mb={2}>
          <DmasSelect
            dmaOptions={dmaOptions}
            values={formValues.DMA || []}
            fieldName="DMA"
            onUpdate={handleArraySelectChange}
          />
        </Box>
        <Box mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                className={classes.checkboxContainer}
                onChange={handleChange}
                edge="start"
                color="default"
                value={formValues.isMoving}
              />
            }
            label="Moving"
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Latitude"
            name="latitude"
            type="number"
            onChange={handleChange}
            value={formValues.latitude}
            variant="outlined"
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Longitude"
            name="longitude"
            type="number"
            onChange={handleChange}
            value={formValues.longitude}
            variant="outlined"
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Group Size"
            name="groupSize"
            type="number"
            onChange={handleChange}
            value={formValues.groupSize}
            variant="outlined"
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            type="number"
            label="Hourly Impressions"
            name="hourlyImpressions"
            onChange={handleChange}
            value={formValues.hourlyImpressions}
            variant="outlined"
          />
        </Box>
        <Box mb={2}>
          <DateRangePicker
            startDateField="dailyUTCStartTime"
            endDateField="dailyUTCendTime"
            startValue={moment(
              new Date(formValues.dailyUTCStartTime),
              dateFormat,
            )}
            endValue={moment(new Date(formValues.dailyUTCendTime), dateFormat)}
            onUpdate={handleDateChange}
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            type="number"
            label="Daily Ad Hours "
            name="dailyHours"
            onChange={handleChange}
            value={formValues.dailyHours}
            variant="outlined"
          />
        </Box>
      </Box>

      <Box p={2} display="flex" alignItems="center">
        <Box flexGrow={1} />
        <Button onClick={onCancel}>Dismiss</Button>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          className={classes.confirmButton}
        >
          {formValue.externalID ? 'Update' : 'Create'}
        </Button>
      </Box>
    </form>
  );
};

export default EndpointForm;
