import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { InputLabel, MenuItem, Select } from '@material-ui/core';
import s from './AppEvent.css';

const helpMessage = `This module requires you to setup a callback on your Mobile Measurement Partner's platform to track App events. Please select below which partner you use so that we can provide you with instructions to get setup.`;

const MMPs = [
  { key: 'apps_flyer', label: 'Apps Flyer' },
  { key: 'adjust', label: 'Adjust' },
  { key: 'kochava', label: 'Kochava' },
  { key: 'tune', label: 'Tune' },
  { key: 'apsalar', label: 'Apsalar' },
  { key: 'singular', label: 'Singular' },
  { key: 'branch', label: 'Branch' },
];

class AppEvent extends Component {
  static propTypes = {
    mmp: PropTypes.string,
    moduleUpdated: PropTypes.func.isRequired,
  };

  static defaultProps = {
    mmp: '',
  };

  handleMMPChanged = event => {
    this.props.moduleUpdated({ mmp: event.target.value });
  };

  render() {
    const { mmp } = this.props;
    return (
      <div>
        <div className={s.helpMessage}>{helpMessage}</div>
        <div>
          <InputLabel id="mmp-select-label">
            Mobile Measurement Partner
          </InputLabel>
          <Select
            id="mmp-select"
            labelId="mmp-select-label"
            onChange={this.handleMMPChanged}
            value={mmp}
            classes={{
              select: s.select,
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {MMPs.map(({ key, label }) => (
              <MenuItem value={key} key={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AppEvent);
