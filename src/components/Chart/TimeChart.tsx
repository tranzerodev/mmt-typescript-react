import React, { useState } from 'react';
import { Card, CardHeader, Divider, createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Chart from './Chart';
import { Spinner } from '../Loading';

const useStyles = makeStyles(() =>
  createStyles({
    VisGraph: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '300px',
    },
    EmptyGraph: {
      height: '200px',
      borderLeft: '2px solid #e6e6e9',
      borderBottom: '2px solid #e6e6e9',
      display: 'flex',
      flexDirection: 'column',
      margin: '40px 20px 20px 80px',
      '& div': {
        borderTop: '1px solid #e6e6e9',
        height: '40px',
      },
    },
  }),
);

const ONE_DAY = 86400000;

const formatTimeStamp = (timeStamp: number) =>
  new Date(timeStamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

const isSameDate = (d1: Date, d2: Date) =>
  new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime() ===
  new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();

const getDate = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

interface ObjectModel {
  [key: number]: number;
}

interface PointModel {
  x: number;
  y: number;
}

interface MetricModel {
  type: string;
  campaignId: string;
  date: string;
  value: string;
}

type TimeChartProps = {
  metrics: MetricModel[];
  dateRange: Date[];
  chartTitle: string;
  isLoading: boolean;
  unit: string;
};

const TimeChart: React.FC<TimeChartProps> = props => {
  const { metrics, dateRange, isLoading, chartTitle, unit } = props;
  const [chartData, setChartData] = useState<PointModel[]>([]);
  const [tickValues, setTickValues] = useState<number[]>([]);
  const [aggregatedData, setAggregatedData] = useState<PointModel[]>([]);

  const classes = useStyles();

  const getDataSeries = (seriesMap: any) => {
    const dataSeries = Object.keys(seriesMap).map(label => ({
      x: +label,
      y: seriesMap[label],
    }));

    if (!dataSeries.length) {
      return dataSeries;
    }

    if (dateRange.length) {
      dataSeries.sort((a, b) => a.x - b.x);
      const startDate = dateRange.length && getDate(dateRange[0]).getTime();
      if (dataSeries[0].x !== startDate) {
        dataSeries.unshift({ x: startDate, y: 0 });
      }

      const seriesLength = dataSeries.length;
      const endDate = dateRange.length && getDate(dateRange[1]).getTime();
      if (dataSeries[seriesLength - 1].x !== endDate) {
        dataSeries.push({ x: endDate, y: 0 });
      }
    }

    let index = 1;
    while (index < dataSeries.length) {
      const currentVal = dataSeries[index];
      let prevVal = dataSeries[index - 1];
      while (currentVal.x - prevVal.x > ONE_DAY) {
        if (isSameDate(new Date(prevVal.x), new Date(prevVal.x + ONE_DAY))) {
          prevVal = { x: prevVal.x + ONE_DAY, y: 0 };
        } else {
          prevVal = { x: prevVal.x + ONE_DAY, y: 0 };
          dataSeries.splice(index, 0, prevVal);
          index += 1;
        }
      }
      index += 1;
    }

    return dataSeries;
  };

  const prepareMetrics = () => {
    const aggregatedValue: ObjectModel = {};
    metrics.forEach((data: any) => {
      const labelDate = getDate(new Date(data.date)).getTime();
      aggregatedValue[labelDate] = aggregatedValue[labelDate]
        ? aggregatedValue[labelDate] + Math.ceil(Number(data.value))
        : Math.ceil(Number(data.value));
    });

    setChartData(getDataSeries(aggregatedValue));
  };

  const getMaxForSteps = () => {
    const dateRangeForSteps =
      (new Date(dateRange[1]).getTime() - new Date(dateRange[0]).getTime()) /
      ONE_DAY;
    let maxVal = Math.ceil(
      (new Date(dateRange[1]).getTime() - new Date(dateRange[0]).getTime()) /
        ONE_DAY,
    );
    if (dateRangeForSteps < 70 && dateRangeForSteps > 7) {
      maxVal /= 7;
    } else if (dateRangeForSteps > 70 && dateRangeForSteps < 360) {
      maxVal /= 30;
    } else if (dateRangeForSteps > 360) maxVal = 10;
    return maxVal;
  };

  const aggregateData = () => {
    const filteredValues = [];
    if (chartData) {
      const maxVal = getMaxForSteps();
      const delta = Math.max(Math.ceil(chartData.length / maxVal), 1);
      for (let i = chartData.length - 1; i >= 0; i -= delta) {
        filteredValues.push(chartData[i]);
      }
      if (filteredValues[filteredValues.length - 1] !== chartData[0])
        filteredValues.push(chartData[0]);
      if (filteredValues.length > 0) {
        setTickValues(filteredValues.reverse().map(point => point.x));
      }
    }
    const tempAggregatedData = filteredValues.map((value, index, array) => ({
      ...value,
      x: value.x,
      y: chartData
        .filter(data =>
          index
            ? data.x <= value.x && data.x > array[index - 1].x
            : data.x <= value.x,
        )
        .reduce((sum: number, leftPoint: PointModel) => sum + leftPoint.y, 0),
    }));
    setAggregatedData(tempAggregatedData);
  };

  React.useEffect(() => {
    prepareMetrics();
  }, [metrics]);

  React.useEffect(() => {
    aggregateData();
  }, [chartData]);

  if (isLoading) {
    return (
      <Card variant="outlined">
        <Spinner />
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardHeader title={chartTitle} />
      <Divider />
      <div className={classes.VisGraph}>
        {chartData && chartData.length === 0 ? (
          <div className={classes.EmptyGraph}>
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        ) : (
          <Chart
            xAxisOptions={{
              tickFormat: formatTimeStamp,
              tickValues,
            }}
            data={aggregatedData}
            unit={unit}
          />
        )}
      </div>
    </Card>
  );
};

export default TimeChart;
