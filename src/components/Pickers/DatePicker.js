import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import withStyles from 'isomorphic-style-loader/withStyles';
import moment from 'moment';
import { DateUtils } from 'react-day-picker';
import { DropDownButton } from '../Buttons';
import { DayPicker } from './ReactDayPicker';
import s from './DatePicker.css';

class DatePicker extends Component {
  constructor(props) {
    super(props);

    // options are intentionally made off by 1
    const options = [
      // 'Today',
      // 'Yesterday',
      { label: 'Last Week', range: 6 },
      { label: 'Last 2 Weeks', range: 13 },
      { label: 'Last 4 Weeks', range: 27 },
    ];
    const selectedOption = props.noRangeSelectedText ? null : options[0];

    let from;
    let to;
    if (selectedOption) {
      from = new Date();
      from.setDate(from.getDate() - selectedOption.range);
      to = new Date();
    }

    this.state = {
      options,
      selectedOption, // Range Option - "Last 7 days"
      from, // Default Range Start Date
      to, // Default Range End Date
      prevFrom: from,
      prevTo: to,
      numberOfMonths: 1,
      showDatePicker: false,
    };
  }

  didDateRangeChange = () => {
    const { from, to, prevFrom, prevTo } = this.state;

    // date range changed if
    // - there if a to/from date but there was no prev to/from date
    // - there if a to/from date and its different than prev to/from date
    return (
      (prevFrom && prevFrom.getTime() !== from.getTime()) ||
      (!prevFrom && from) ||
      (prevTo && prevTo.getTime() !== to.getTime()) ||
      (!prevTo && to)
    );
  };

  // If Date Range is updated, Call API
  handleAPICall = (from, to) => {
    const { dateChanged } = this.props;
    const toDate = to || new Date(from);
    this.setState(
      {
        showDatePicker: false,
        prevFrom: from,
        prevTo: toDate,
      },
      () => {
        from.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        dateChanged(from, toDate);
      },
    );
  };

  // Select Custom Date Range.
  handleDayClick = day => {
    const range = DateUtils.addDayToRange(day, this.state);
    if (range.from && range.from === range.to) {
      range.to = new Date(range.from.getTime());
    }

    if (range.from !== null && range.to !== null) {
      this.setState({
        from: range.from,
        to: range.to,
        selectedOption: undefined,
      });
    }
  };

  // Select Radio Option
  handleOptionChange = selectedOption => {
    const { range } = selectedOption;

    let to = new Date();
    const from = new Date(new Date().setDate(new Date().getDate() - range));
    if (selectedOption.label === 'Yesterday') {
      to = new Date(new Date().setDate(new Date().getDate() - range));
    }

    this.setState({
      selectedOption,
      to,
      from,
    });
  };

  handleClick = () => {
    const { showDatePicker: originalDatePickerState } = this.state;
    const showDatePicker = !originalDatePickerState;
    const { from, to } = this.state;

    if (showDatePicker) {
      this.setState({
        showDatePicker,
        container: 'datePicker-show',
      });
    } else if (this.didDateRangeChange()) {
      this.handleAPICall(from, to);
    } else {
      this.setState({
        showDatePicker,
      });
    }
  };

  handleClickOutside = () => {
    const { showDatePicker, from, to } = this.state;
    if (showDatePicker) {
      if (this.didDateRangeChange()) {
        this.handleAPICall(from, to);
      } else {
        this.setState({
          showDatePicker: false,
        });
      }
    }
  };

  renderQuickOptions = () => {
    const { hideQuickOptions } = this.props;
    if (hideQuickOptions) {
      return null;
    }

    const { options, selectedOption } = this.state;

    return (
      <div className={s.radioGroup}>
        {options.map(option => (
          <label className={s.radio} key={option.range} htmlFor={option.range}>
            <input
              id={option.range}
              type="radio"
              checked={
                selectedOption ? selectedOption.range === option.range : false
              }
              onChange={() => this.handleOptionChange(option)}
            />
            <div className={s.label}>{option.label}</div>
          </label>
        ))}
      </div>
    );
  };

  render() {
    const { noRangeSelectedText } = this.props;
    const {
      from,
      to,
      selectedOption,
      numberOfMonths,
      showDatePicker,
    } = this.state;
    const modifiers = { start: from, end: to };

    let text = noRangeSelectedText;
    if (selectedOption) {
      text = selectedOption.label;
    } else if (from && to) {
      text = `${moment(from).format('MM/DD/YYYY')} - ${moment(to).format(
        'MM/DD/YYYY',
      )}`;
    }

    return (
      <div className={s.container}>
        <DropDownButton
          text={text}
          handleClick={this.handleClick}
          showDataPicker={showDatePicker}
        />
        {showDatePicker && (
          <div className={s.datePicker}>
            {this.renderQuickOptions()}
            <DayPicker
              className="Selectable"
              numberOfMonths={numberOfMonths}
              selectedDays={from || to ? [from, { from, to }] : undefined}
              modifiers={modifiers}
              onDayClick={this.handleDayClick}
            />
          </div>
        )}
      </div>
    );
  }
}

DatePicker.propTypes = {
  dateChanged: PropTypes.func.isRequired,
  hideQuickOptions: PropTypes.bool,
  noRangeSelectedText: PropTypes.string,
};

DatePicker.defaultProps = {
  hideQuickOptions: false,
  noRangeSelectedText: null,
};

export default withStyles(s)(onClickOutside(DatePicker));
