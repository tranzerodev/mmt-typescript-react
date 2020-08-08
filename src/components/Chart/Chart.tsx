// / <reference types="react-vis-types" />
import React, { useState } from 'react';
import { useTheme, makeStyles, createStyles } from '@material-ui/core/styles';
import withStyles from 'isomorphic-style-loader/withStyles';
import moment from 'moment';
import reactVisCss from 'react-vis/dist/style.css';
import {
  FlexibleXYPlot,
  HorizontalGridLines,
  XAxis,
  YAxis,
  Crosshair,
  LineMarkSeries,
} from 'react-vis';
import CustomAxisLabel from './CustomAxisLabel';
import { xAxisStyle, yAxisStyle, scaleYValues } from './GraphProperties';

const useStyles = makeStyles(() =>
  createStyles({
    LineChart: {
      '& circle': {
        cursor: 'pointer',
        opacity: '0 !important',
        '&:hover': {
          opacity: '1 !important',
          fill: 'green !important',
        },
      },
    },

    TooltipContainer: {
      width: '100%',
      border: '#eee solid 3px',
      background: 'white',
      color: '#000',
      padding: '2px 4px',
      borderradius: '4px',
    },
    TooltipX: {
      fontSize: '12px',
      fontWeight: 500,
      color: 'gray',
    },
  }),
);

interface XAxisOptions {
  tickFormat: (timeStamp: number) => string;
  tickValues: number[];
}

interface PointModel {
  x: number;
  y: number;
}

type PlotOptions = {
  yDomain?: number[];
};

type ChartProps = {
  xAxisOptions: XAxisOptions;
  data: PointModel[];
  unit: string;
};

const Chart: React.FC<ChartProps> = props => {
  const { unit, xAxisOptions, data } = props;
  const [tooltipPoint, setTooltipPoint] = useState<PointModel>({ x: 0, y: 0 });
  const classes = useStyles();
  const theme = useTheme();

  const onNearestX = (point: PointModel) => {
    setTooltipPoint({ x: point.x, y: point.y });
  };

  const onMouseLeave = () => {
    setTooltipPoint({ x: 0, y: 0 });
  };

  const renderTooltip = () => {
    const crossHairValues = [{ x: tooltipPoint.x, y: tooltipPoint.y }];
    return (
      <Crosshair values={crossHairValues}>
        <div className={classes.TooltipContainer}>
          <div className={classes.TooltipX}>
            {tooltipPoint.y} {unit}
          </div>
          <div className={classes.TooltipX}>
            {moment(tooltipPoint.x).format('MMMM Do YYYY')}
          </div>
        </div>
      </Crosshair>
    );
  };

  const plotOptions: PlotOptions = {};
  if (data && data.length === 1) {
    const metricVal = data[0].y;
    plotOptions.yDomain = [0, metricVal * 1.3];
  } else if (data) {
    const yValues = data.map(xyVal => xyVal.y);
    const maxY = Math.max(...yValues) * 1.2;
    const upperBound = Math.ceil(maxY / 5) * 5;
    plotOptions.yDomain = [0, upperBound || 1];
  }

  return (
    <FlexibleXYPlot
      className={classes.LineChart}
      onMouseLeave={onMouseLeave}
      margin={{ left: 80, right: 40, top: 40, bottom: 40 }}
      {...plotOptions}
    >
      <HorizontalGridLines />
      <XAxis {...xAxisOptions} style={xAxisStyle} />
      <YAxis tickFormat={scaleYValues} style={yAxisStyle} />
      <LineMarkSeries
        curve="curveMonotoneX"
        data={data}
        color={theme.palette.primary.main}
        onSeriesMouseOut={onMouseLeave}
        onNearestX={(value: any) => onNearestX(value)}
      />
      {renderTooltip()}
      <CustomAxisLabel title={unit} />
    </FlexibleXYPlot>
  );
};

export default withStyles(reactVisCss)(Chart);
