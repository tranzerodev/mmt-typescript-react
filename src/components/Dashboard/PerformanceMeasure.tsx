import React, { useState } from 'react';
import uniqBy from 'lodash/uniqBy';
import { Box, Grid, styled } from '@material-ui/core';
import PERFORMANCE_CARD_DATA from '../../constants/performanceConsts';
import MetricSummary from './MetricSummary';
import TimeChart from '../Chart/TimeChart';

const MeasureContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const SummaryContainer = styled(Grid)({
  marginBottom: '16px',
});

const MetricSummaryContainer = styled(Grid)({
  marginBottom: '16px',
  maxWidth: '310px',
});

interface PerformanceModel {
  key: string;
  id: string;
  title: string;
  value: number;
  unit: string;
  icon: JSX.Element;
}

interface CampaignModel {
  id: string;
  performanceModules: PerformanceModel[];
}

interface MetricsModel {
  data: any[];
  locations: any[];
  regionData: any[];
  isLoading: boolean;
  loadingLocations: boolean;
  loadingRegions: boolean;
}

interface MetricModel {
  type: string;
  campaignId: string;
  date: string;
  value: string;
}

type PerformanceMeasureProps = {
  campaigns: CampaignModel[];
  metrics: MetricsModel;
  dateRange: Date[];
  selectedCampaignIds: string[];
};

const PerformanceMeasure: React.FC<PerformanceMeasureProps> = props => {
  const { metrics, dateRange, campaigns, selectedCampaignIds } = props;
  const [filteredPerformances, setFilteredPerformances] = useState<
    PerformanceModel[]
  >([]);
  const [
    selectedPerformance,
    setSelectedPerformance,
  ] = useState<PerformanceModel | null>(null);
  const [filteredMetrics, setFilteredMetrics] = useState<MetricModel[]>([]);

  const getFilteredMetrics = (selectedPerformanceId: string) =>
    metrics.data.filter(
      d =>
        (selectedCampaignIds && selectedCampaignIds.length > 0
          ? selectedCampaignIds.includes(d.campaignId)
          : true) &&
        d.type === selectedPerformanceId &&
        (new Date(d.date).getTime() >= dateRange[0].getTime() &&
          new Date(d.date).getTime() <= dateRange[1].getTime()),
    );

  const setFilteredPerformancesData = () => {
    const filteredPerformanceMods: PerformanceModel[] = uniqBy(
      campaigns
        .filter(campaign =>
          selectedCampaignIds && selectedCampaignIds.length > 0
            ? selectedCampaignIds.includes(campaign.id)
            : true,
        )
        .reduce(
          (acc: PerformanceModel[], item: CampaignModel) =>
            acc.concat(item.performanceModules || {}),
          [],
        ),
      'id',
    );

    let filteredPerformancesData = PERFORMANCE_CARD_DATA.filter(
      card =>
        filteredPerformanceMods.findIndex(
          mod => mod.id === card.key || mod.id === card.id,
        ) > -1,
    );
    if (filteredPerformancesData && filteredPerformancesData.length > 0) {
      filteredPerformancesData = filteredPerformancesData.map(
        (item: PerformanceModel) => ({
          ...item,
          value: metrics.data.reduce(
            (sum: number, metricsItem: MetricModel) =>
              metricsItem.type === item.key &&
              (new Date(metricsItem.date).getTime() >= dateRange[0].getTime() &&
                new Date(metricsItem.date).getTime() <= dateRange[1].getTime())
                ? sum + Number(metricsItem.value)
                : sum,
            0,
          ),
        }),
      );
    }
    return filteredPerformancesData;
  };

  const filterData = () => {
    const filteredPerformancesData = setFilteredPerformancesData();
    if (filteredPerformancesData && filteredPerformancesData.length > 0) {
      const filteredMetricsData = getFilteredMetrics(
        selectedPerformance && selectedPerformance.key
          ? selectedPerformance.key
          : filteredPerformancesData[0].key,
      );
      setFilteredMetrics(filteredMetricsData);
      setFilteredPerformances(filteredPerformancesData);
      if (!selectedPerformance) {
        setSelectedPerformance(filteredPerformancesData[0]);
      }
    }
  };

  React.useEffect(() => {
    filterData();
  }, [metrics, campaigns, dateRange, selectedCampaignIds, selectedPerformance]);

  const onClickSummary = (key: string) => {
    const index = filteredPerformances.findIndex(
      performance => performance.key === key,
    );
    if (index > -1) setSelectedPerformance(filteredPerformances[index]);
  };

  return (
    <MeasureContainer>
      <SummaryContainer container spacing={2} justify="flex-start">
        {filteredPerformances.map(item => (
          <MetricSummaryContainer item key={item.id} xs={3}>
            <MetricSummary
              title={item.title}
              value={item.value.toFixed(2)}
              isSelected={
                selectedPerformance
                  ? selectedPerformance.key === item.key
                  : false
              }
              icon={item.icon}
              onClickSummary={() => onClickSummary(item.key)}
            />
          </MetricSummaryContainer>
        ))}
      </SummaryContainer>
      <Box width={1}>
        <TimeChart
          metrics={filteredMetrics}
          dateRange={dateRange}
          chartTitle={selectedPerformance ? selectedPerformance.title : ''}
          isLoading={false}
          unit={selectedPerformance ? selectedPerformance.unit : ''}
        />
      </Box>
    </MeasureContainer>
  );
};

export default PerformanceMeasure;
