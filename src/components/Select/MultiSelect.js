import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import {
  Checkbox,
  Chip,
  Input,
  ListItemText,
  MenuItem,
  Select,
} from '@material-ui/core';
import s from './MultiSelect.css';

const MultiSelect = ({
  id,
  options,
  values,
  onChange,
  disabled: rootDisabled,
  labelId,
}) => {
  const optionsLabelByKey = {};
  options.forEach(o => {
    optionsLabelByKey[o.key] = o.label;
  });
  return (
    <Select
      id={id}
      classes={{
        root: s.largeRoot,
        select: s.select,
      }}
      onChange={onChange}
      input={<Input id={`${id}-input`} />}
      value={values}
      renderValue={selected => (
        <div className={s.chips}>
          {selected.map(value => (
            <Chip key={value} label={optionsLabelByKey[value] || value} />
          ))}
        </div>
      )}
      labelId={labelId || `${id}-label`}
      multiple
      disabled={rootDisabled}
    >
      {options.map(({ key, label, disabled = false }) => (
        <MenuItem key={key} value={key} disabled={disabled}>
          <Checkbox checked={values && values.includes(key)} />
          <ListItemText primary={label} />
        </MenuItem>
      ))}
    </Select>
  );
};

MultiSelect.propTypes = {
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
  disabled: PropTypes.bool,
};

MultiSelect.defaultProps = {
  values: [],
  labelId: '',
  disabled: false,
};

export default withStyles(s)(MultiSelect);
