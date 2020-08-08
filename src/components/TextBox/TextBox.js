import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
// eslint-disable-next-line css-modules/no-unused-class
import s from './TextBox.css';

const nonInputProps = ['size', 'spacing', 'formatType', 'active', 'maxLines'];

class TextBox extends Component {
  static propTypes = {
    maxLines: PropTypes.number,
    size: PropTypes.string,
    spacing: PropTypes.string,
    formatType: PropTypes.string,
    active: PropTypes.bool,
  };

  static defaultProps = {
    maxLines: 1,
    size: 'full',
    spacing: 'noSpace',
    active: true,
    formatType: null,
  };

  render() {
    const inputProps = Object.assign({}, this.props);
    nonInputProps.forEach(prop => {
      delete inputProps[prop];
    });
    const isCurrency = this.props.formatType === 'currency';
    const currencyOptions = {};
    if (isCurrency) {
      inputProps.value = inputProps.value.toLocaleString();
    }

    return (
      <div
        className={`${s.root} ${s[this.props.size]} ${s[this.props.spacing]}`}
      >
        {isCurrency ? '$' : ''}
        {this.props.maxLines > 1 ? (
          <textarea
            {...this.props}
            className={s.input}
            key="input"
            rows={this.props.maxLines}
          />
        ) : (
          <input
            className={`${s.input} ${this.props.active ? '' : s.inactiveInput}`}
            key="input"
            type="text"
            {...inputProps}
            {...currencyOptions}
          />
        )}
      </div>
    );
  }
}

export default withStyles(s)(TextBox);
