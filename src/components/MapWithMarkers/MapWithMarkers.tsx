import React, { useState } from 'react';
import { GoogleMap, MarkerClusterer, Marker } from '@react-google-maps/api';
import { loadMapScript } from '../../utils/MapUtils';
import { MarkerModel } from '../../constants/dataTypes';

const mapContainerStyle = {
  height: '400px',
  width: '520px',
};

const center = { lat: -28.024, lng: 140.887 };
const MaxFitZoom = 15;

const options = {
  imagePath:
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
};

interface MapProps {
  markers: MarkerModel[];
  mapOptions?: google.maps.MapOptions;
}

const MapWithMarkers: React.FC<MapProps> = ({ markers, mapOptions }) => {
  const [mapRef, setMapRef] = useState(null);

  const fitBounds = (map: any) => {
    if (map && markers && markers.length) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.map(marker => {
        bounds.extend(marker);
        return marker.id;
      });

      // handle bound for only one marker
      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        const extendPoint1 = new google.maps.LatLng(
          bounds.getNorthEast().lat() + 0.01,
          bounds.getNorthEast().lng() + 0.01,
        );
        const extendPoint2 = new google.maps.LatLng(
          bounds.getNorthEast().lat() - 0.01,
          bounds.getNorthEast().lng() - 0.01,
        );
        bounds.extend(extendPoint1);
        bounds.extend(extendPoint2);
      }

      map.fitBounds(bounds);
      // set the default after fitting bounds;
      map.setZoom(Math.min(map.getZoom(), MaxFitZoom));
    }
  };

  React.useEffect(() => {
    fitBounds(mapRef);
  }, [markers.length]);

  const { isLoaded } = loadMapScript();

  const loadHandler = (map: any) => {
    setMapRef(map);
    fitBounds(map);
  };

  const getClusteredMarkers = (clusterer: any) => {
    const markerElems: JSX.Element[] = [];
    markers.forEach(location => {
      if (location.count && location.count > 1) {
        for (let i = 0; i < location.count; i += 1) {
          markerElems.push(
            <Marker
              key={`${location.id}_m${i}`}
              position={location}
              clusterer={clusterer}
            />,
          );
        }
      } else {
        markerElems.push(
          <Marker
            key={location.id}
            position={location}
            clusterer={clusterer}
          />,
        );
      }
    });
    return markerElems;
  };

  const renderMap = () => (
    <>
      <GoogleMap
        onLoad={loadHandler}
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        zoom={3}
        center={center}
        clickableIcons={false}
        options={mapOptions}
      >
        <MarkerClusterer options={options}>
          {clusterer => getClusteredMarkers(clusterer)}
        </MarkerClusterer>
      </GoogleMap>
    </>
  );

  return isLoaded ? renderMap() : null;
};

MapWithMarkers.defaultProps = {
  mapOptions: {
    streetViewControl: false,
    mapTypeControl: false,
  },
};

export default MapWithMarkers;
