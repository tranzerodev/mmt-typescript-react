import React from 'react';

interface CustomAxisLabelProps {
  title: string;
  xAxis?: boolean;
  innerWidth?: number;
  innerHeight?: number;
}

declare const CustomAxisLabel: React.SFC<CustomAxisLabelProps>;
export default CustomAxisLabel;
