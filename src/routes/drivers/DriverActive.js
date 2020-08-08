import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './DriverActive.css';

class DriverActive extends Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
  };

  render() {
    let content = null;
    if (this.props.isActive) {
      content = (
        <div>
          <h2>Payment setup complete</h2>
          <div className={s.textSection}>
            Your earnings will be automatically transferred to your account.
          </div>
          <div className={s.textSection}>
            <b>Switch to the app</b> and start earning
          </div>
        </div>
      );
    } else {
      content = (
        <div>
          <h2>Payment setup failed</h2>
          <div className={s.textSection}>
            Your payment account could not be setup. Try the setup again.
          </div>
          <div className={s.textSection}>
            <b>Switch to the app</b>
          </div>
        </div>
      );
    }

    return content;
  }
}

export default withStyles(s)(DriverActive);
