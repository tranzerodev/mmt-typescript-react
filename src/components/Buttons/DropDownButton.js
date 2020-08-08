import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './DropDownButton.css';

class DropDownButton extends PureComponent {
  static propTypes = {
    handleClick: PropTypes.func.isRequired,
    text: PropTypes.string,
    icon: PropTypes.element,
    showDataPicker: PropTypes.bool,
  };

  static defaultProps = {
    text: null,
    icon: null,
    showDataPicker: false,
  };

  getButtonElement = children => (
    <button className={s.btn} onClick={this.props.handleClick}>
      {children}
    </button>
  );

  render() {
    let button = null;
    let buttonContent = null;
    const { text, icon } = this.props;

    if (text) {
      buttonContent = (
        <div className={s.container}>
          <div className={s.text}>{text}</div>
          <div>
            {this.props.showDataPicker ? (
              <KeyboardArrowUpIcon style={{ fontSize: 20 }} />
            ) : (
              <KeyboardArrowDownIcon style={{ fontSize: 20 }} />
            )}
          </div>
        </div>
      );
    } else if (icon) {
      buttonContent = <div>{icon}</div>;
    }

    if (this.props.handleClick) {
      button = this.getButtonElement(buttonContent);
    }

    return button;
  }
}

export default withStyles(s)(DropDownButton);
