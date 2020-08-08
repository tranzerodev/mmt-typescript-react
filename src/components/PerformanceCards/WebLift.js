import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './WebLift.css';
import MultiSelect from '../Select/MultiSelect';

const helpMessage = `This module requires you to add tracking pixels to your website that monitor different actions. Tell us which actions you want to track as conversions for this campaign and we will follow up with you about implementation details.`;

const Events = [
  { key: 'site_visit', label: 'Site Visit' },
  { key: 'signup', label: 'Sign Up' },
  { key: 'checkout', label: 'Checkout' },
];

class WebLift extends Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.string),
    moduleUpdated: PropTypes.func.isRequired,
  };

  static defaultProps = {
    events: [],
  };

  handleEventSelected = event => {
    this.props.moduleUpdated({ events: event.target.value });
  };

  render() {
    const { events } = this.props;
    return (
      <div>
        <div className={s.helpMessage}>{helpMessage}</div>
        <div>
          <MultiSelect
            id="web-event-select"
            options={Events}
            values={events}
            onChange={this.handleEventSelected}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(WebLift);
