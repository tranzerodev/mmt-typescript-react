import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import * as s from './Footer.css';

interface FooterProps {
  sticks: boolean;
  children: React.ReactNode;
}

class Footer extends React.Component<FooterProps, {}> {
  static defaultProps = {
    sticks: false,
  };

  render() {
    const { sticks } = this.props;
    const classes = [s.root, s.padded];
    if (sticks) {
      classes.push(s.sticks);
    }
    return <div className={classes.join(' ')}>{this.props.children}</div>;
  }
}

export default withStyles(s)(Footer);
