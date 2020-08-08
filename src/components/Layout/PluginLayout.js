import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
// eslint-disable-next-line css-modules/no-unused-class
import s from './Layout.css';

class PluginLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <div className={s.container}>
        <div className={s.contentContainer}>{this.props.children}</div>
      </div>
    );
  }
}

export default withStyles(s)(PluginLayout);
