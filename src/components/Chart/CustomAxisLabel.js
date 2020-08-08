import React from 'react';
import PropTypes from 'prop-types';

const CustomAxisLabel = props => {
  const { innerHeight, title, innerWidth, xAxis } = props;
  // since we rotate the y label, we have to adjust it to center
  // (ideally we'd rotate about the correct origin, but that shit is not working)
  const yLabelOffset = {
    y: innerHeight / 2 + title.length * 7,
    x: 20,
  };

  // 1.2 was enough for me to get it below x axis. you may need a diff't #
  const xLabelOffset = {
    x: innerWidth / 2,
    y: 1.4 * innerHeight,
  };

  const transform = xAxis
    ? `translate(${xLabelOffset.x}, ${xLabelOffset.y})`
    : `translate(${yLabelOffset.x}, ${yLabelOffset.y}) rotate(-90)`;

  return (
    <g transform={transform}>
      <text style={{ fill: '#878b91', fontSize: 16 }}>{title}</text>
    </g>
  );
};

CustomAxisLabel.displayName = 'CustomAxisLabel';
CustomAxisLabel.requiresSVG = true;

CustomAxisLabel.propTypes = {
  title: PropTypes.string.isRequired,
  xAxis: PropTypes.bool,
  innerWidth: PropTypes.number,
  innerHeight: PropTypes.number,
};

CustomAxisLabel.defaultProps = {
  xAxis: false,
  innerWidth: 714, // determined by debugging defaults
  innerHeight: 212, // determined by debugging defaults
};

export default CustomAxisLabel;
