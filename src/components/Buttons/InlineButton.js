import React from 'react';
import PropTypes from 'prop-types';

const s = {
  outline: 'none',
};

class InlineButton extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    children: PropTypes.node,
    disableKeyPress: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    children: null,
    disableKeyPress: false,
  };

  handleClick = e => this.props.handleSubmit(e);

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.props.handleSubmit();
    }
  };

  render() {
    const { children, className, disableKeyPress } = this.props;

    const inlineButtonProps = {
      role: 'button',
      onClick: this.handleClick,
      tabIndex: 0,
    };

    if (!disableKeyPress) {
      inlineButtonProps.onKeyPress = this.handleKeyPress;
    }

    if (className) {
      inlineButtonProps.className = className;
    }

    return (
      <div style={s} {...inlineButtonProps}>
        {children}
      </div>
    );
  }
}

export default InlineButton;
