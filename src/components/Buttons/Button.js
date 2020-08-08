import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button as BootstrapButton } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/withStyles';
// eslint-disable-next-line css-modules/no-unused-class
import s from './Button.css';

const propsToIgnore = ['buttonClasses'];

class Button extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    buttonClasses: PropTypes.arrayOf(
      PropTypes.oneOf(['primary', 'secondary', 'normal', 'title', 'small']),
    ),
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
      .isRequired,
  };

  static defaultProps = {
    buttonClasses: ['normal'],
  };

  render() {
    const { buttonClasses } = this.props;
    const classNames = buttonClasses.map(cls => s[cls]).join(' ');
    const className = `${s.btn} ${classNames}`;

    const otherProps = {};
    Object.keys(this.props).forEach(propKey => {
      if (!propsToIgnore.includes(propKey)) {
        otherProps[propKey] = this.props[propKey];
      }
    });

    return <BootstrapButton className={className} {...otherProps} />;
  }
}

export default withStyles(s)(Button);
