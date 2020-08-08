import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import normalizeCss from 'normalize.css';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { makeStyles, createStyles, Container } from '@material-ui/core';
import history from '../../history';
import { clearUser, loadAuthenticatedUser } from '../../store/user/actions';
import { SpinnerContainer } from '../Loading';

// external-global styles must be imported in your JS.
import s from './Layout.css';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { AuthModal } from '../Auth';
import AlertSnackbar from '../AlertSnackbar';
import { userPropType } from '../../store/user/reducers';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
    },
  }),
);

const Layout = ({ user, loadUser, children, signOut }) => {
  const classes = useStyles();
  const [openSidebarMobile, setOpenSidebarMobile] = useState(false);
  // this replaces component did mount hook
  useEffect(() => {
    loadUser();
  }, [user.id]);

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      await signOut();
      history.push('/');
    } catch (err) {
      // TODO: handle the error
    }
  };

  const renderChilderen = user.loaded
    ? React.Children.map(children, child => React.cloneElement(child, { user }))
    : null;
  return (
    <div className={classes.root}>
      <Navbar
        user={user}
        signOut={handleSignOut}
        onOpenSidebarMobile={() => setOpenSidebarMobile(true)}
        theme="dark"
      />
      <Sidebar
        user={user}
        onMobileClose={() => setOpenSidebarMobile(false)}
        openMobile={openSidebarMobile}
      />
      {renderChilderen}
      <AuthModal />
      <AlertSnackbar />
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(loadAuthenticatedUser()),
  signOut: () => dispatch(clearUser()),
});

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  user: userPropType.isRequired,
  signOut: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(normalizeCss, s)(Layout));
