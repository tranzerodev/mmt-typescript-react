import * as React from 'react';
import moment, { Moment } from 'moment';
import { Grid } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

interface DateRangePickerProps {
  startValue: Moment;
  endValue: Moment;
  startDateField: string;
  endDateField: string;
  onUpdate: (data: { [fieldName: string]: string }) => void;
}
const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startValue,
  endValue,
  startDateField,
  endDateField,
  onUpdate,
}) => {
  const dateFormat = 'MM/DD/YYYY';
  const handleStartDateChange = (date: MaterialUiPickersDate | null) => {
    onUpdate({ [startDateField]: moment(date as Moment).format(dateFormat) });
  };

  const handleEndDateChange = (date: MaterialUiPickersDate | null) => {
    onUpdate({ [endDateField]: moment(date as Moment).format(dateFormat) });
  };

  return (
    <Grid container>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Grid item md={6} xs={12}>
          <KeyboardDatePicker
            disableToolbar
            margin="normal"
            variant="inline"
            id="start-date-picker"
            label="Start"
            format={dateFormat}
            value={startValue}
            onChange={handleStartDateChange}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <KeyboardDatePicker
            disableToolbar
            margin="normal"
            variant="inline"
            id="end-date-picker"
            label="Finish"
            format={dateFormat}
            value={endValue}
            onChange={handleEndDateChange}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </Grid>
  );
};

export default DateRangePicker;
