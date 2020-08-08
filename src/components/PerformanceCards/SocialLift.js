import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@material-ui/core';

import s from './SocialLift.css';

const helpMessage = `This module requires you to specify the platforms on which you want to track social lift and specify the hashtags and branded terms you want to track.`;

const SocialPlatformOptions = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'twitter', label: 'Twitter' },
];

class SmsResponse extends Component {
  constructor() {
    super();
    this.state = { hashTagError: false };
  }

  handleHashtagsChanged = event => {
    try {
      const { platforms, moduleUpdated } = this.props;
      const input = event.target.value;
      const values = input.split(',');
      const hashtags = values.map(k => k.trim());
      this.setState({ hashTagError: false }, () =>
        moduleUpdated({
          hashtags,
          platforms,
        }),
      );
    } catch (ex) {
      this.setState({ hashTagError: true });
    }
  };

  handlePlatformChange = (platformKey, checked) => {
    const { hashtags, platforms, moduleUpdated } = this.props;
    const newPlatforms = platforms.filter(p => p !== platformKey);
    if (checked) {
      newPlatforms.push(platformKey);
    }

    moduleUpdated({
      hashtags,
      platforms: newPlatforms,
    });
  };

  render() {
    const { hashTagError } = this.state;
    const { hashtags, platforms } = this.props;
    return (
      <div>
        <div className={s.helpMessage}>{helpMessage}</div>
        <div className={s.sectionLabel}>Social Media Platforms</div>
        <FormGroup>
          {SocialPlatformOptions.map(({ key, label }) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={platforms.includes(key)}
                  size="small"
                  classes={{ root: s.checkboxWrapper }}
                  onChange={e =>
                    this.handlePlatformChange(key, e.target.checked)
                  }
                  value={key}
                  color="primary"
                />
              }
              label={label}
            />
          ))}
        </FormGroup>
        <TextField
          error={hashTagError}
          id="hashtags-text-input"
          label="Hashtags"
          helperText="Separate words and phrases with commas"
          value={hashtags.join(', ')}
          placeholder="Hashtags and branded terms"
          onChange={this.handleHashtagsChanged}
          fullWidth
        />
      </div>
    );
  }
}

SmsResponse.propTypes = {
  hashtags: PropTypes.arrayOf(PropTypes.string),
  platforms: PropTypes.arrayOf(PropTypes.string),
  moduleUpdated: PropTypes.func.isRequired,
};

SmsResponse.defaultProps = {
  hashtags: [],
  platforms: [],
};

export default withStyles(s)(SmsResponse);
