import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Divider, Box, Tab, Tabs, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import intersection from 'lodash/intersection';
import { userPropType } from '../../store/user/reducers';
import { campaignPropType } from '../../store/campaigns/reducers';
import { PackagePropType } from '../../store/experiences/types';
import {
  reserveCampaignPackage,
  updateCampaign as updateCampaignAction,
  loadCampaign as loadCampaignAction,
  clearReserveCampaignAction,
} from '../../store/campaigns/actions';
import PackageCampaignDetails from './PackageCampaignDetails';
import TabPanel from '../TabPanel';
import { PerformanceTab, CreativeTab, CreativeSubtitle } from '../Create';
import { NewButton } from '../UI';
import { openAuthModal } from '../../store/ui/actions';
import ClientSelectionModal from '../Client/ClientSelectionModal';
import { AllClientSelectValue } from '../Create/ClientSelect';
import ConfirmModal from '../Modals/ConfirmModal';
import * as UserUtils from '../../utils/UserUtils';
import history from '../../history';
import portalConfig from '../../portalConfig';
import PERFORMANCE_CARD_DATA, {
  DEFAULT_PERFORMACE_MODULES,
} from '../../constants/performanceConsts';

export { PackageCampaignDetails };

const packageCampaignTabs = [
  { value: 'details', label: 'Details' },
  { value: 'measurement', label: 'Measurement' },
  { value: 'creative', label: 'Creative' },
];

function PackageCampaign({
  campaignId,
  packageItem,
  user,
  campaigns,
  reservingPackage,
  reservedCampaign,
  reservePackage,
  clearReservedCampaign,
  updateCampaign,
  loadCampaign,
  openSignUpModal,
}) {
  const [tab, setTab] = React.useState(packageCampaignTabs[0].value);
  const [campaign, setCampaign] = React.useState({
    performanceModules: [],
    creativeFiles: [],
    creativeUrls: [],
  });

  const [isModalOpened, setModalOpened] = React.useState(false);

  const [currentClientId, setCurrentClientId] = React.useState('');

  const confirmMessage = `You have made a reservation with ${
    portalConfig.Company
  }. They have been contacted and will be in touch with next steps.`;

  const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false);

  const openClientModal = () => {
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
  };

  const handleConfirmModalClose = () => {
    setIsConfirmModalOpened(false);
  };

  const handleConfirm = () => {
    setIsConfirmModalOpened(false);
    history.push('/dashboard');
  };

  const handleUpdateClient = clientId => {
    setCurrentClientId(clientId);
    setModalOpened(false);
  };

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  const handleCampaignUpdated = updatedData => {
    setCampaign({ ...campaign, ...updatedData });
  };

  const handleSave = () => {
    if (user.isUnAuth) {
      openSignUpModal();
    } else if (campaignId) {
      updateCampaign(campaign);
    } else {
      const campaignData = { ...campaign };

      const { Start, End } = packageItem;
      const tz = moment.tz.guess();
      // set start date to 30 days from now
      if (Start) {
        moment.tz(Start, tz);
      }
      const startDate = Start ? moment.tz(Start, tz) : moment();
      if (!Start) {
        startDate.add(1, 'months');
      }
      startDate.startOf('day');
      campaignData.startDate = startDate.toISOString();

      // end date is only set when:
      // package has a specific end date OR
      // package doesn't have a specific Start date that means
      // we want to use default start and end dates
      if (!Start || End) {
        // set end date to be 90 days from today
        const endDate = End ? moment.tz(End, tz) : moment(startDate);
        if (!End) {
          endDate.add(3, 'months');
        }
        endDate.endOf('day');
        campaignData.endDate = endDate.toISOString();
      }

      if (
        !UserUtils.IsClient(user) &&
        packageItem.Customer === AllClientSelectValue
      ) {
        if (currentClientId) {
          campaignData.Customer = currentClientId;
          reservePackage(user.id, packageItem.id, campaignData);
          return;
        }
        openClientModal();
        return;
      }
      reservePackage(user.id, packageItem.id, campaignData);
    }
  };

  React.useEffect(() => {
    if (currentClientId) {
      handleSave();
    }
  }, [currentClientId]);

  React.useEffect(() => {
    if (!reservingPackage && reservedCampaign) {
      setIsConfirmModalOpened(true);
      clearReservedCampaign();
    }
  }, [reservingPackage, reservedCampaign]);

  React.useEffect(() => {
    if (campaignId) loadCampaign(campaignId);
  }, [campaignId]);

  React.useEffect(() => {
    const currentCampaign = campaigns.find(item => item.id === campaignId);
    if (currentCampaign) {
      setCampaign(currentCampaign);
    }
  }, [campaigns]);

  React.useEffect(() => {
    setCampaign({
      ...campaign,
      performanceModules: PERFORMANCE_CARD_DATA.filter(card =>
        intersection(
          packageItem.performanceModules || [],
          DEFAULT_PERFORMACE_MODULES,
        ).find(defaultId => defaultId === card.id),
      ).map(card => ({
        id: card.key,
      })),
    });
  }, [packageItem]);

  return (
    <Box width={1}>
      <Box
        mx={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4">{packageItem.name}</Typography>
        <Box>
          <NewButton onClick={handleSave} htmlId="btn-new-campaign">
            {campaignId ? 'Save' : 'Reserve'}
          </NewButton>
        </Box>
      </Box>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
      >
        {packageCampaignTabs.map(t => (
          <Tab key={t.value} value={t.value} label={t.label} />
        ))}
      </Tabs>
      <Divider />
      <TabPanel tabKey={packageCampaignTabs[0].value} selectedTab={tab}>
        <PackageCampaignDetails packageItem={packageItem} />
      </TabPanel>
      <TabPanel
        tabKey={packageCampaignTabs[1].value}
        selectedTab={tab}
        horizontalSpace
      >
        <PerformanceTab
          performanceModules={campaign.performanceModules || []}
          supportedPerfModules={packageItem.Performance}
          onUpdate={handleCampaignUpdated}
          noContainer
        />
      </TabPanel>
      <TabPanel
        tabKey={packageCampaignTabs[2].value}
        selectedTab={tab}
        horizontalSpace
      >
        <Typography variant="h5">{CreativeSubtitle}</Typography>
        <CreativeTab
          creativeUrls={campaign.creativeUrls || []}
          creativeFiles={campaign.creativeFiles || []}
          screenTypes={packageItem.endpointTypes || []}
          onUpdate={handleCampaignUpdated}
          noContainer
        />
      </TabPanel>
      <ClientSelectionModal
        onSelect={handleUpdateClient}
        onCancel={handleModalClose}
        open={isModalOpened}
      />
      <ConfirmModal
        title="Reservation Made"
        message={confirmMessage}
        onConfirm={handleConfirm}
        open={isConfirmModalOpened}
      />
    </Box>
  );
}

PackageCampaign.propTypes = {
  user: userPropType.isRequired,
  campaigns: PropTypes.arrayOf(campaignPropType).isRequired,
  campaignId: PropTypes.string,
  packageItem: PackagePropType.isRequired,
  reservePackage: PropTypes.func.isRequired,
  reservedCampaign: campaignPropType.isRequired,
  reservingPackage: PropTypes.bool.isRequired,
  clearReservedCampaign: PropTypes.func.isRequired,
  updateCampaign: PropTypes.func.isRequired,
  loadCampaign: PropTypes.func.isRequired,
  openSignUpModal: PropTypes.func,
};

PackageCampaign.defaultProps = {
  campaignId: '',
  openSignUpModal: null,
};

const mapStateToProps = state => ({
  user: state.user,
  campaigns: state.campaigns.data,
  reservingPackage: state.campaigns.reservingPackage,
  reservedCampaign: state.campaigns.reservedCampaign,
});

const mapDispatchToProps = dispatch => ({
  reservePackage: (userId, packageId, campaignData) =>
    dispatch(reserveCampaignPackage(userId, packageId, campaignData)),
  clearReservedCampaign: () => dispatch(clearReserveCampaignAction()),
  updateCampaign: campaignData => dispatch(updateCampaignAction(campaignData)),
  loadCampaign: campaignId => dispatch(loadCampaignAction(campaignId)),
  openSignUpModal: () => dispatch(openAuthModal('signUp')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PackageCampaign);
