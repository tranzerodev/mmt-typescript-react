import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AudienceLocationMap from '../Audiences/AudienceLocationMap';
import { UsersApi } from '../../clients';
import { loadMapScript } from '../../utils/MapUtils';

const MapQueryParams = {
  startDate: moment('2019-10-10')
    .startOf('day')
    .toISOString(),
  endDate: moment('2019-10-10')
    .endOf('day')
    .toISOString(),
  source: 'GPS',
};

function PackageRegionMap({ regions }) {
  const [locations, setLocations] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [boundingBox, setBoundingBox] = React.useState([]);

  const { isLoaded: isGoogleMapsLoaded } = loadMapScript();

  React.useEffect(() => {
    async function getLocations() {
      const responses = await Promise.all(
        regions.map(region => {
          // dont load locations for DMA regions
          if (region.startsWith('dma_')) {
            return { Items: [] };
          }

          const getLocationsParams = {
            ...MapQueryParams,
            ...boundingBox,
            regions: [region],
          };
          return UsersApi.getLocations(getLocationsParams);
        }),
      );
      setLocations([].concat(...responses.map(r => r.Items)));
      setLoading(false);
    }

    setLoading(true);
    getLocations();
  }, [boundingBox]);

  return isGoogleMapsLoaded ? (
    <AudienceLocationMap
      selectedLocationIds={regions}
      locations={locations}
      featureLoaded={setBoundingBox}
      loadingLocations={loading}
    />
  ) : null;
}

PackageRegionMap.propTypes = {
  regions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PackageRegionMap;
