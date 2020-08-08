import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import InlineButton from './InlineButton';
import s from './LinkButton.css';

class LinkButton extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

  render() {
    const { text } = this.props;

    return (
      <InlineButton
        className={s.linkButton}
        handleSubmit={this.props.onClick}
        disableKeyPress
      >
        {text}
      </InlineButton>
    );
  }
}

export default withStyles(s)(LinkButton);
