import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
// eslint-disable-next-line css-modules/no-unused-class
import s from './Layout.css';

const UnAuthLayout = ({ children }) => (
  <div className={s.container}>
    <div className={s.contentContainer}>{children}</div>
  </div>
);

UnAuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withStyles(s)(UnAuthLayout);
