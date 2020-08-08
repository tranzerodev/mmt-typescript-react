/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './ReserveConfirmationModal.css';

class ReserveConfirmationModal extends PureComponent {
  render() {
    return (
      <div className={s.container}>
        <div>Click Continue below to go to Dashboard.</div>
        <div>
          From the Dashboard you can provide additional information for your
          campaign including:
        </div>
        <div>
          <ul className={s.detailsList}>
            <li>Duration & Budget</li>
            <li>Measurement Goals</li>
            <li>Creatives</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ReserveConfirmationModal);
