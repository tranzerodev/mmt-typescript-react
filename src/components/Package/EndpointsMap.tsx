import React, { useState } from 'react';
import MapWithMarkers from '../MapWithMarkers/MapWithMarkers';
import { MarkerModel } from '../../constants/dataTypes';
import { Endpoint } from '../../store/endpoints/types';

type EndpointsMapProps = {
  data: Endpoint[];
  packageId: string;
};

const EndpointsMap: React.FC<EndpointsMapProps> = props => {
  const { packageId, data } = props;
  const [markers, setMarkers] = useState<MarkerModel[]>([]);

  const getMarkersFromEndpoints = () => {
    if (data && data.length) {
      setMarkers(
        data.map(
          (marker: Endpoint, i: number): MarkerModel => ({
            id: `${marker.endpointId}_e${i}`,
            lat: marker.latitude,
            lng: marker.longitude,
            count: marker.groupSize,
          }),
        ),
      );
    } else {
      setMarkers([]);
    }
  };

  React.useEffect(() => {
    getMarkersFromEndpoints();
  }, [packageId]);

  return <MapWithMarkers markers={markers} />;
};

export default EndpointsMap;
