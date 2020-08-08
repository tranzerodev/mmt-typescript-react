import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import PackageRegionMap from './PackageRegionMap';

function RegionMapList({ data, regions }) {
  let regionIds = regions || [];
  if (!regionIds.length) {
    regionIds = (data || []).map(r => `dma_${r.code}`);
  }

  if (!regionIds.length) {
    return <PackageRegionMap regions={[]} />;
  }

  return (
    <Box display="flex" overflow="auto">
      {regionIds.map(r => (
        <Box key={r} mr={1} flex="1 0" flexBasis={300}>
          <PackageRegionMap regions={[r]} />
        </Box>
      ))}
    </Box>
  );
}

RegionMapList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      code: PropTypes.number,
    }),
  ),
  regions: PropTypes.arrayOf(PropTypes.string),
};

RegionMapList.defaultProps = {
  data: [],
  regions: [],
};

export default RegionMapList;
