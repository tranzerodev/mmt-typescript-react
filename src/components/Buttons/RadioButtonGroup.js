/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './RadioButtonGroup.css';

class RadioButtonGroup extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  handleChange = event => {
    this.props.onChange(event.target.value);
  };

  render() {
    const { options, value, name, disabled } = this.props;

    return (
      <div className={s.toggleButtonGroup}>
        {options.map(opt => {
          const id = `${name}-${opt.value}`;
          const isSelected = opt.value.toString() === value.toString();
          const itemClasses = [s.toggleButtonItem];
          if (disabled) {
            itemClasses.push(s.disabledToggleButtonItem);
          }
          if (isSelected) {
            itemClasses.push(s.selectedToggleButtonItem);
          }

          return (
            <div className={itemClasses.join(' ')} key={id}>
              <input
                id={id}
                type="radio"
                className={s.toggleButtonInput}
                value={opt.value}
                checked={isSelected}
                onChange={this.handleChange}
                disabled={disabled}
              />
              <label htmlFor={id} className={s.toggleButtonLabel}>
                {opt.label}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withStyles(s)(RadioButtonGroup);
