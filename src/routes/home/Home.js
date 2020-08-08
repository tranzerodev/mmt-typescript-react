import React from 'react';
import { connect } from 'react-redux';
import { userPropType } from '../../store/user/reducers';
import * as UserUtils from '../../utils/UserUtils';
import history from '../../history';

function Home({ user }) {
  if (UserUtils.IsClient(user)) {
    history.push('/feed');
  } else {
    history.push('/dashboard');
  }
  return null;
}

Home.propTypes = {
  user: userPropType.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Home);
