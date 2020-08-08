/* global google */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './AudienceLocationMap.css';
import { Spinner } from '../Loading';
import { LocationUtils } from '../../utils';

const NyLat = 40.740999;
const NyLng = -73.99237;

class AudienceLocationMap extends Component {
  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps) {
    const { selectedLocationIds, locations } = this.props;
    const { selectedLocationIds: prevLocationIds } = prevProps;

    const existingLocations = selectedLocationIds.filter(loc =>
      prevProps.selectedLocationIds.includes(loc),
    );
    const newLocations = selectedLocationIds.filter(
      loc => !prevProps.selectedLocationIds.includes(loc),
    );

    // when all the previous locations are in the next locations props
    // only need to load new location items
    if (existingLocations.length === prevLocationIds.length) {
      this.loadDataLayer(newLocations);
    } else if (selectedLocationIds.join() !== prevLocationIds.join()) {
      // when locations removed or new audience picked clear and reload all
      this.loadDataLayer(selectedLocationIds, true);
    }

    if (prevProps.locations.length !== locations.length) {
      this.updateHeatmapData();
    }
  }

  componentWillUnmount() {
    if (this.googleTimer) {
      clearTimeout(this.googleTimer);
    }
  }

  getMapId = () => {
    const { selectedLocationIds } = this.props;
    return `${selectedLocationIds.join('-')}_audienceMap`;
  };

  loadMap = () => {
    try {
      const _ = google; // eslint-disable-line no-unused-vars
    } catch (e) {
      this.googleTimer = setTimeout(() => {
        this.loadMap();
      }, 300);
      return;
    }

    const {
      selectedLocationIds,
      featureLoaded,
      radius,
      dissipating,
      locations,
    } = this.props;
    const center = new google.maps.LatLng(NyLat, NyLng);
    this.map = new google.maps.Map(document.getElementById(this.getMapId()), {
      zoom: 10,
      center,
      clickableIcons: false,
      streetViewControl: false,
      mapTypeControl: false,
    });

    this.bounds = new google.maps.LatLngBounds();
    this.map.data.addListener('addfeature', e => {
      LocationUtils.processPoints(
        e.feature.getGeometry(),
        this.bounds.extend,
        this.bounds,
      );
      featureLoaded(LocationUtils.getItemFromBounds(this.bounds));
      this.map.fitBounds(this.bounds);
    });

    this.loadDataLayer(selectedLocationIds);

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      radius,
      dissipating,
      maxIntensity: 10,
    });
    this.updateHeatmapData();
  };

  loadDataLayer = (locationIds, clearOldLocations) => {
    if (clearOldLocations) {
      this.bounds = new google.maps.LatLngBounds();
      this.map.data.forEach(feature => {
        this.map.data.remove(feature);
      });
    }

    locationIds.forEach(locId => {
      this.map.data.loadGeoJson(LocationUtils.getGeoJsonUrl(locId));
    });
    this.map.data.setStyle({
      strokeColor: '#009900',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#006600',
      fillOpacity: 0.35,
    });
  };

  updateHeatmapData = () => {
    const { locations } = this.props;
    if (this.heatmap) {
      if (locations.length) {
        // add filter to ensure valid values .filter(l => l.longitude && l.latitude && l.weight)
        this.heatmap.setData(
          locations.map(l => ({
            // weight: l.weight,
            location: new google.maps.LatLng(
              l.roadLatitude || l.latitude || l.lat,
              l.roadLongitude || l.longitude || l.lng,
            ),
          })),
        );
        this.map.data.setStyle({
          fillOpacity: 0,
          strokeWeight: 1,
          strokeColor: '#006600',
        });
      } else {
        this.heatmap.setData([]);
      }
    }
  };

  render() {
    const { height, loadingLocations } = this.props;
    const mapContainerProps = {
      className: s.mapContainer,
      id: this.getMapId(),
    };

    if (height) {
      mapContainerProps.style = { height: `${height}px` };
    }

    return (
      <div className={s.container}>
        <div {...mapContainerProps} />
        <div className={s.loadingContainer}>
          {loadingLocations && <Spinner />}
        </div>
      </div>
    );
  }
}

AudienceLocationMap.propTypes = {
  height: PropTypes.number,
  selectedLocationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  featureLoaded: PropTypes.func.isRequired,
  radius: PropTypes.number,
  dissipating: PropTypes.bool,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      roadLatitude: PropTypes.number,
      roadLongitude: PropTypes.number,
      weight: PropTypes.number,
    }),
  ),
  loadingLocations: PropTypes.bool,
};

AudienceLocationMap.defaultProps = {
  height: null,
  radius: 10,
  dissipating: true,
  locations: [],
  loadingLocations: false,
};

export default withStyles(s)(AudienceLocationMap);
