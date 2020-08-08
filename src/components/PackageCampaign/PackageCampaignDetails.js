import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { openAuthModal } from '../../store/ui/actions';
import { userPropType } from '../../store/user/reducers';
import { PackagePropType } from '../../store/experiences/types';
import Footer from '../Footer';
import { ModalButton } from '../Modals';
import {
  PackageDetail,
  PackageCategoryDetails,
  EndpointsMap,
  PackageSummary,
  PreviewSection,
  ReserveConfirmationModal,
} from '../Package';
import RegionMapList from './RegionMapList';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      paddingTop: '32px',
      paddingBottom: '32px',
    },
    darkSection: {
      backgroundColor: '#1f2023',
      color: '#fff',
    },
  }),
);

function PackageCampaignDetails({
  packageItem,
  savingPackage,
  packageReserved,
  openSignUpModal,
  user,
}) {
  const classes = useStyles();

  const handleReserveClicked = () => {
    let shouldOpenReserveModal = true;
    if (user.isUnAuth) {
      openSignUpModal();
      shouldOpenReserveModal = false;
    }
    return shouldOpenReserveModal;
  };

  const getMapDetailComponent = categoryObjs =>
    categoryObjs.some(c => c.name === 'Transit - Car Fins')
      ? RegionMapList
      : EndpointsMap;

  const mapDetailComponent = packageItem.categories
    ? getMapDetailComponent(packageItem.categories)
    : null;

  const packageDetailProperties = [
    { key: 'About', data: packageItem.about, label: 'About' },
    {
      key: 'Map',
      data: packageItem.Endpoints,
      label: 'Map',
      DetailComponent: mapDetailComponent,
    },
    {
      key: 'Categories',
      data: packageItem.Endpoints,
      label: 'Formats',
      DetailComponent: PackageCategoryDetails,
    },
    {
      key: 'Dates',
      data: packageItem.Dates,
      formatter: dates =>
        dates &&
        `${new Date(dates.startDate).toLocaleDateString()} to ${new Date(
          dates.endDate,
        ).toLocaleDateString()}`,
      label: 'Dates',
    },
    {
      key: 'Price',
      data: packageItem.budget,
      formatter: val =>
        val &&
        val.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
      label: 'Price',
    },
  ];

  const dmaNames = packageItem.DMA
    ? packageItem.DMA.map(dmaItem => dmaItem.name)
    : [];

  return (
    <>
      <Grid
        container
        justify="center"
        classes={{ root: classes.darkSection, container: classes.container }}
      >
        <Grid item xs={10}>
          <PreviewSection packageItem={packageItem} />
          <PackageSummary name={packageItem.name} dmas={dmaNames} />
        </Grid>
      </Grid>
      <Grid
        container
        justify="center"
        classes={{ container: classes.container }}
      >
        <Grid item xs={10}>
          {packageDetailProperties.map(
            ({ key, data, formatter, label, DetailComponent }) => (
              <PackageDetail
                key={key}
                id={key}
                label={label}
                value={
                  DetailComponent ? (
                    <DetailComponent
                      data={data}
                      packageId={packageItem.id}
                      regions={packageItem.regions}
                      endpoints={packageItem.endpoints}
                    />
                  ) : (
                    (data && formatter && formatter(data)) || data
                  )
                }
              />
            ),
          )}
        </Grid>
      </Grid>
      {packageReserved && (
        <Footer sticks>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width={1}
          >
            <Box>{packageItem.name}</Box>
            <ModalButton
              label="reserve-experience-modal"
              descriptioin="Reserve Experience Campaign"
              title="Your Campaign is Ready"
              color="primary"
              variant="contained"
              mainComponent={<ReserveConfirmationModal />}
              onOpenClick={handleReserveClicked}
              completeButtonText="Continue"
              onCompleteClick={packageReserved}
              text="Reserve"
              showSpinner={savingPackage}
            />
          </Box>
        </Footer>
      )}
    </>
  );
}

PackageCampaignDetails.propTypes = {
  user: userPropType.isRequired,
  packageItem: PackagePropType.isRequired,
  packageReserved: PropTypes.func,
  savingPackage: PropTypes.bool.isRequired,
  openSignUpModal: PropTypes.func.isRequired,
};

PackageCampaignDetails.defaultProps = {
  packageReserved: null,
};

const mapStateToProps = state => ({
  user: state.user,
  isLoading: state.experiences.loadingPackage,
  savingPackage: state.campaigns.reservingPackage,
});

const mapDispatchToProps = dispatch => ({
  openSignUpModal: () => dispatch(openAuthModal('signUp')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PackageCampaignDetails);
