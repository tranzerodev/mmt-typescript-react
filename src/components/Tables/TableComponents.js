/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { ReactTableDefaults } from 'react-table';
import s from './TableComponents.css';

export const TableHeader = withStyles(s)(({ text }) => (
  <span className={s.headerText}>{text}</span>
));

export const ActionRow = withStyles(s)(({ children }) => (
  <div className={s.actionRow}>{children}</div>
));

export const ExpanderComponent = withStyles(s)(props => {
  if (props.subRows.length === 1) {
    return <div className={s.emptyExpander} />;
  }

  return <ReactTableDefaults.ExpanderComponent {...props} expndable={false} />;
});

ExpanderComponent.propTypes = {
  subRows: PropTypes.array,
};

export const InputCell = withStyles(s)(
  ({ index, column, overrides, value, onChange }) => {
    let val = value;
    if (overrides && (overrides[column.id] || overrides[column.id] === '')) {
      val = overrides[column.id];
    }

    return (
      <input
        className={s.tableInput}
        onChange={e => onChange(index, column.id, e.target.value)}
        value={val}
      />
    );
  },
);

InputCell.propTypes = {
  index: PropTypes.number,
  column: PropTypes.object,
  overrides: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
};
