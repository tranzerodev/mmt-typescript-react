import React, { useState, useEffect, FC } from 'react';
import { Box, makeStyles, Grid } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import PerformanceMeasure from '../../components/Dashboard/PerformanceMeasure';
import CampaignSummaryTable from '../../components/Campaigns';
import DatePicker from '../../components/Pickers/DatePicker';
import * as ReduxType from '../../store/reduxTypes';
import {
  PageContent,
  Flex,
  FullCard,
  DenseCardContent,
  NewLinkButton,
  PageTitle,
} from '../../components/UI';
import WelcomeMessage from '../../components/Dashboard/WelcomeMessage';
import { getMetrics, getMockMetrics } from '../../store/metrics/actions';
import { getCampaigns } from '../../store/campaigns/actions';
import * as UserUtils from '../../utils/UserUtils';

const useStyles = makeStyles({
  contentSection: {
    height: 'fit-content',
    marginBottom: 20,
  },
  campaignActions: {
    margin: 0,
  },
  lastAction: {
    marginLeft: 10,
  },
  fullCard: {
    overflow: 'initial',
  },
});

const mapStateToProps = (state: ReduxType.RootState) => ({
  user: state.user,
  campaigns: state.campaigns.data,
  metrics: state.metrics,
  isListLoaded: state.campaigns.isListLoaded,
  isLoading: state.campaigns.isLoading,
});

const mapDispatchToProps = (dispatch: ReduxType.AppThunkDispatch) => ({
  loadMetrics: (userId: string, startDate: string, endDate: string) => {
    dispatch(getMetrics(userId, startDate, endDate));
  },
  loadMockMetrics: () => {
    dispatch(getMockMetrics());
  },
  loadCampaignList: () => {
    dispatch(getCampaigns());
  },
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

const DashboardPage: FC<PropsFromRedux> = ({
  user,
  campaigns,
  isListLoaded,
  isLoading,
  metrics,
  loadMetrics,
  loadMockMetrics,
  loadCampaignList,
}) => {
  const classes = useStyles();
  const [selectedCampaign, setSelectedCampaign] = useState([]);

  const startDate = new Date(new Date().setDate(new Date().getDate() - 6));
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const [dateRange, setDateRange] = useState([startDate, endDate]);

  const loadData = () => {
    if (!user.isUnAuth && user.id) {
      loadMetrics(
        user.id,
        dateRange[0].toISOString(),
        dateRange[1].toISOString(),
      );
    } else {
      loadMockMetrics();
    }
  };

  useEffect(() => {
    if (!isListLoaded && !isLoading) {
      loadCampaignList();
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [dateRange, user]);

  const handleDateChanged = (from: string, to: string) => {
    setDateRange([new Date(from), new Date(to)]);
  };

  return (
    <PageContent>
      <WelcomeMessage user={user} />

      <div className={classes.contentSection}>
        <PerformanceMeasure
          campaigns={campaigns}
          metrics={metrics}
          dateRange={dateRange}
          selectedCampaignIds={selectedCampaign}
        />
      </div>

      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <PageTitle title="Campaigns" />
        <Flex>
          <DatePicker dateChanged={handleDateChanged} />
          {!UserUtils.IsClient(user) && (
            <div className={classes.lastAction}>
              <NewLinkButton
                htmlId="campaign-new-campaign"
                path="/create?type=campaign"
              >
                New Campaign
              </NewLinkButton>
            </div>
          )}
        </Flex>
      </Grid>
      <FullCard className={classes.fullCard} variant="outlined">
        <DenseCardContent>
          <CampaignSummaryTable campaigns={campaigns} />
        </DenseCardContent>
      </FullCard>
    </PageContent>
  );
};

export default connector(DashboardPage);
