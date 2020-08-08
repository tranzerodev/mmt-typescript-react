import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Box, Grid } from '@material-ui/core';
import EndpointSummaryTable, {
  CreateEndpointModal,
  useEndpointFormSet,
} from '../../components/Endpoints';
import {
  PageContent,
  FullCard,
  DenseCardContent,
  PageTitle,
  NewButton,
} from '../../components/UI';
import {
  listEndpointsByUser,
  createEndpoint,
} from '../../store/endpoints/actions';
import { EndpointFormValueType } from '../../store/endpoints/types';
import * as ReduxType from '../../store/reduxTypes';
import SearchInput from '../../components/SearchInput/SearchInput';

const mapStateToProps = (state: ReduxType.RootState) => ({
  userId: state.user.id,
  endpoints: state.endpoints.items,
  options: state.options.data,
  loadedEndpoints: state.endpoints.loadedEndpoints,
  campaignOptions: state.options.data,
});

const mapDispatchToProps = (dispatch: ReduxType.AppThunkDispatch) => ({
  loadEndpointsByUser: (userId: string) =>
    dispatch(listEndpointsByUser(userId)),
  createEndpointAction: (newEndpoint: EndpointFormValueType) =>
    dispatch(createEndpoint(newEndpoint)),
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

const EndpointsPage: React.FC<PropsFromRedux> = props => {
  const {
    userId,
    options,
    endpoints,
    loadedEndpoints,
    createEndpointAction,
  } = props;
  React.useEffect(() => {
    props.loadEndpointsByUser(userId);
  }, []);
  const [
    currentData,
    isOpenModal,
    onCancel,
    setIsOpenModal,
  ] = useEndpointFormSet();

  const [searchKey, setSearchKey] = React.useState('');

  const handleSubmit = (newEndpoint: EndpointFormValueType) => {
    createEndpointAction(newEndpoint);
    onCancel();
  };

  const handleSearchKeyChange = (value: string) => {
    setSearchKey(value);
  };

  return (
    <PageContent>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <PageTitle title="Endpoints" />
        <Box display="flex" justifyContent="space-between">
          <Box mr={4}>
            <SearchInput
              searchLabel="endpoints"
              handleChange={handleSearchKeyChange}
            />
          </Box>

          <NewButton
            onClick={() => setIsOpenModal(true)}
            htmlId="btn-create-endpoint"
          >
            New Endpoint
          </NewButton>
        </Box>
      </Grid>
      <CreateEndpointModal
        open={isOpenModal}
        formValue={currentData}
        onCancel={onCancel}
        handleSubmit={handleSubmit}
      />

      <FullCard variant="outlined">
        <DenseCardContent>
          <EndpointSummaryTable
            searchKey={searchKey}
            options={options}
            endpoints={endpoints}
            loadedEndpoints={loadedEndpoints}
          />
        </DenseCardContent>
      </FullCard>
    </PageContent>
  );
};

export default connector(EndpointsPage);
