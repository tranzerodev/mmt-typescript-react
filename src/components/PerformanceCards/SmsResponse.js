import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { TextField } from '@material-ui/core';

import s from './SmsResponse.css';

const helpMessage = `This module requires you to specify which keyword needs to be sent to the phone number in order for a response to be sent and a tracking event to occur. If you select this option we will follow up with and tell you which phone number to use on the creative.`;

class SmsResponse extends Component {
  static propTypes = {
    keywords: PropTypes.string,
    response: PropTypes.string,
    moduleUpdated: PropTypes.func.isRequired,
  };

  static defaultProps = {
    keywords: '',
    response: '',
  };

  constructor() {
    super();
    this.state = { keywordError: false };
  }

  handleKeywordsChanged = event => {
    try {
      const { response } = this.props;
      const input = event.target.value;
      // const values = input.split(',');
      // const keywords = values.map(k => k.trim());
      const keywords = input.trim();
      this.setState({ keywordError: false }, () =>
        this.props.moduleUpdated({
          keywords,
          response,
        }),
      );
    } catch (ex) {
      this.setState({ keywordError: true });
    }
  };

  handleResponseChanged = event => {
    const { keywords } = this.props;
    const input = event.target.value;
    this.props.moduleUpdated({
      keywords,
      response: input,
    });
  };

  render() {
    const { keywords, response } = this.props;
    return (
      <div>
        <div className={s.helpMessage}>{helpMessage}</div>
        <TextField
          error={this.state.keywordError}
          id="keyword-text-input"
          label="Keyword"
          value={keywords}
          placeholder="e.g. wheels"
          onChange={this.handleKeywordsChanged}
          fullWidth
        />
        <TextField
          id="response-multiline-input"
          label="Automatic Response Message"
          multiline
          rows="4"
          value={response}
          onChange={this.handleResponseChanged}
          fullWidth
          inputProps={{
            maxLength: 160,
          }}
          helperText={`160 character limit. (${response.length}/160)`}
          margin="normal"
        />
      </div>
    );
  }
}

export default withStyles(s)(SmsResponse);
