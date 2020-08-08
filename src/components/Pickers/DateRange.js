/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import withStyles from 'isomorphic-style-loader/withStyles';
import styled from 'styled-components';
import s from './DateRange.css';
import { DayPickerInput } from './';
import TextBox from '../TextBox';

const CancelEndDate = styled(IconButton)`
  && {
    position: absolute;
    right: 0;
    z-index: var(--textboxActionIconIndex);
    padding: 0;
    bottom: 3px;
    &:hover {
      cursor: pointer;
    }
  }
`;

const hiddenInputProps = {
  style: {
    opacity: 0,
  },
};

const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

class DateRange extends Component {
  static propTypes = {
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    showLabel: PropTypes.bool,
    disabled: PropTypes.bool,
    dateRangeChanged: PropTypes.func.isRequired,
  };

  static defaultProps = {
    startDate: new Date(),
    endDate: null,
    showLabel: true,
    disabled: false,
  };

  handleStartDayChange = startDate => {
    const { endDate } = this.props;
    if (endDate) {
      const dayDiff = (endDate - startDate) / (1000 * 24 * 3600);
      if (dayDiff < 30) {
        this.props.dateRangeChanged(startDate, null);
        return;
      }
    }

    this.props.dateRangeChanged(startDate, this.props.endDate);
  };

  handleEndDayChange = endDate =>
    this.props.dateRangeChanged(this.props.startDate, endDate);

  render() {
    const today = new Date();
    const { startDate, endDate, showLabel, disabled } = this.props;

    const startDayPickerProps = { disabledDays: { before: today } };

    if (endDate) {
      const end = new Date(endDate);
      const maxValForStartDate = new Date(end.getTime());
      maxValForStartDate.setDate(maxValForStartDate.getDate() - 1);
      startDayPickerProps.disabledDays.after = maxValForStartDate;
    }

    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 30);
    const minRangeForEndDate = new Date(minEndDate.getTime());
    const endDayPickerProps = {
      disabledDays: { before: minRangeForEndDate },
      month: minRangeForEndDate,
    };

    return (
      <div className={s.durationSeciton}>
        <div className={s.dateSelectorContainer}>
          {showLabel && <div className={s.label}>START</div>}
          <TextBox
            value={
              isSameDay(today, startDate)
                ? 'Immediately'
                : startDate.toLocaleDateString()
            }
            disabled
          />
          {!disabled && (
            <div className={s.datePicker}>
              <DayPickerInput
                dayPickerProps={startDayPickerProps}
                value={startDate}
                onDayChange={this.handleStartDayChange}
                inputProps={hiddenInputProps}
              />
            </div>
          )}
        </div>
        <div className={s.dateSelectorContainer}>
          {endDate && !disabled && (
            <CancelEndDate onClick={() => this.handleEndDayChange()}>
              <HighlightOffIcon />
            </CancelEndDate>
          )}
          {showLabel && <div className={s.label}>END</div>}
          <TextBox
            value={endDate ? endDate.toLocaleDateString() : 'No End Date'}
            disabled
          />
          {!disabled && (
            <div className={s.datePicker}>
              <DayPickerInput
                dayPickerProps={endDayPickerProps}
                value={endDate || ''}
                onDayChange={this.handleEndDayChange}
                inputProps={hiddenInputProps}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(DateRange);
