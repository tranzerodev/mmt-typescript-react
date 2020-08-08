import React, { Component } from 'react';
import PropTypes, { object } from 'prop-types';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import MovingEndpointSummaryTable from '../../components/Endpoints/MovingEndpointSummaryTable';
import {
  PageContent,
  FullCard,
  DenseCardContent,
  TableTitle,
  PageTitle,
} from '../../components/UI';
import { endpointPropType } from '../../store/endpoints/types';
import { listEndpointsByUser } from '../../store/endpoints/actions';
import { userPropType } from '../../store/user/reducers';

class MovingEndpoints extends Component {
  render() {
    const { movingEndpoints, loadedMovingEndpoints } = this.props;
    return (
      <PageContent>
        <PageTitle title="Moving Endpoints" />
        <FullCard variant="outlined">
          <TableTitle title="All Moving Endpoints" />
          <Divider />
          <DenseCardContent>
            <MovingEndpointSummaryTable
              movingEndpoints={movingEndpoints}
              loadedMovingEndpoints={loadedMovingEndpoints}
            />
          </DenseCardContent>
        </FullCard>
      </PageContent>
    );
  }
}

MovingEndpoints.propTypes = {
  movingEndpoints: PropTypes.arrayOf(endpointPropType).isRequired,
  loadedMovingEndpoints: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  movingEndpoints: state.endpoints.movingEndpoints,
  loadedMovingEndpoints: state.endpoints.loadedMovingEndpoints,
});

export default connect(mapStateToProps)(MovingEndpoints);
