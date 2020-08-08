import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import { Grid } from '@material-ui/core';
import PackagesTable from '../../components/PackagesTable';
import {
  PageContent,
  FullCard,
  DenseCardContent,
  NewLinkButton,
  TableTitle,
  PageTitle,
} from '../../components/UI';
import {
  getPackagesForUser,
  deletePackage,
} from '../../store/packages/actions';
import * as ReduxType from '../../store/reduxTypes';

const mapStateToProps = (state: ReduxType.RootState) => ({
  userId: state.user.id,
  packages: state.packages.items,
  updatingPackage: state.packages.updatingPackage,
  loadedPackages: state.packages.loadedPackages,
  isLoading: state.packages.isLoading,
});

const mapDispatchToProps = (dispatch: ReduxType.AppThunkDispatch) => ({
  getPackages: () => dispatch(getPackagesForUser()),
  deletePackageAction: (packageId: string, userId: string) =>
    dispatch(deletePackage(packageId, userId)),
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

const PackagesPage: React.FC<PropsFromRedux> = props => {
  // Generate 15 of rows:
  // Todo: Get Packages from API
  const {
    packages,
    isLoading,
    loadedPackages,
    deletePackageAction,
    userId,
  } = props;

  React.useEffect(() => {
    if (!loadedPackages && !isLoading) {
      props.getPackages();
    }
  }, []);

  /**
   * <NewLinkButton path="/create?type=package">
            New Proposal
          </NewLinkButton>
   */
  return (
    <PageContent>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <PageTitle title="Proposals" />
        <NewLinkButton
          path="/create?type=package"
          htmlId="package-new-proposal"
        >
          New Proposal
        </NewLinkButton>
      </Grid>
      <FullCard variant="outlined">
        <DenseCardContent>
          <PackagesTable
            packages={packages}
            loadedPackages={loadedPackages}
            deletePackage={id => deletePackageAction(id, userId)}
          />
        </DenseCardContent>
      </FullCard>
    </PageContent>
  );
};

export default connector(PackagesPage);
