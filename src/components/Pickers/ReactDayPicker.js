import React from 'react';
import ReactDayPicker from 'react-day-picker';
import ReactDayPickerInput from 'react-day-picker/DayPickerInput';
import DayPickerCss from 'react-day-picker/lib/style.css';
import withStyles from 'isomorphic-style-loader/withStyles';

export const DayPickerInput = withStyles(DayPickerCss)(props => (
  <ReactDayPickerInput {...props} />
));

export const DayPicker = withStyles(DayPickerCss)(props => (
  <ReactDayPicker {...props} />
));
