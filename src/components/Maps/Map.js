/* global google */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Spinner } from '../Loading';
import { LocationUtils } from '../../utils';
import s from './Map.css';

// const MAX_LOCATION_POINTS = 20000;
const sanFranciscoLat = 37.679113;
const sanFranciscoLong = -122.283031;

const isSameCircle = (c1, c2) =>
  c1.radius === c2.radius && c1.lat === c2.lat && c1.lng === c2.lng;

class Map extends Component {
  static propTypes = {
    locations: PropTypes.arrayOf(
      PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        roadLatitude: PropTypes.number,
        roadLongitude: PropTypes.number,
        weight: PropTypes.number,
      }),
    ),
    circles: PropTypes.arrayOf(
      PropTypes.shape({
        radius: PropTypes.number,
        center: PropTypes.shape({
          lat: PropTypes.number,
          lng: PropTypes.number,
        }),
      }),
    ),
    markers: PropTypes.arrayOf(
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
        label: PropTypes.string,
      }),
    ),
    loadingLocations: PropTypes.bool,
    onBoundsUpdated: PropTypes.func,
    radius: PropTypes.number,
    dissipating: PropTypes.bool,
    height: PropTypes.number,
    onCirclesCreated: PropTypes.func,
  };

  static defaultProps = {
    onBoundsUpdated: null,
    onCirclesCreated: null,
    radius: 20,
    dissipating: true,
    loadingLocations: false,
    locations: [],
    circles: [],
    markers: [],
    height: 500,
  };

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps) {
    const { locations, circles } = this.props;
    if (prevProps.locations.length !== locations.length) {
      this.updateHeatmapData();
    }

    let matchedCircles = 0;
    prevProps.circles.forEach(prevC => {
      const matched = circles.filter(c => isSameCircle(c, prevC));
      if (matched.length) {
        matchedCircles += 1;
      }
    });

    if (
      prevProps.circles.length !== circles.length ||
      prevProps.circles.length !== matchedCircles
    ) {
      this.updateMapCircles();
    }
  }

  componentWillUnmount() {
    if (this.googleTimer) {
      clearTimeout(this.googleTimer);
    }
  }

  loadMap = () => {
    try {
      const _ = google; // eslint-disable-line no-unused-vars
    } catch (e) {
      this.googleTimer = setTimeout(() => {
        this.loadMap();
      }, 300);
      return;
    }

    const { circles } = this.props;
    const centerCoords = circles.length
      ? LocationUtils.averageGeolocation(
          circles.map(({ center }) => ({
            latitude: center.lat,
            longitude: center.lng,
          })),
        )
      : { latitude: sanFranciscoLat, longitude: sanFranciscoLong };

    const center = new google.maps.LatLng(
      centerCoords.latitude,
      centerCoords.longitude,
    );

    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center,
      clickableIcons: false,
      streetViewControl: false,
      mapTypeControl: false,
    });

    this.map.addListener('bounds_changed', () => {
      if (this.props.onBoundsUpdated) {
        const bounds = this.map.getBounds();
        if (bounds) {
          this.props.onBoundsUpdated(
            bounds.getNorthEast(),
            bounds.getSouthWest(),
          );
        }
      }
    });

    this.markers = [];
    this.updateMapMarkers();

    this.circles = [];
    this.updateMapCircles();

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      radius: this.props.radius,
      dissipating: this.props.dissipating,
      maxIntensity: 10,
    });
    this.updateHeatmapData();
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
      } else {
        this.heatmap.setData([]);
      }
    }
  };

  updateMapCircles = () => {
    const { circles, onCirclesCreated } = this.props;

    // clear any existing circles
    this.circles.forEach(c => c.setMap(null));

    this.circles = circles.map(
      ({ center, radius }) =>
        new google.maps.Circle({
          strokeColor: '#009900',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#006600',
          fillOpacity: 0.35,
          map: this.map,
          center,
          radius,
        }),
    );

    if (onCirclesCreated) {
      // pass the "minimum bounding rectangle" for all circles drawn
      onCirclesCreated(
        this.circles.map(c => LocationUtils.getMinimumBoundingRectangle(c)),
      );
    }
  };

  updateMapMarkers = () => {
    // add markers to map
    const { markers } = this.props;
    this.markers = markers
      .map(marker => {
        if (!marker) {
          return null;
        }

        const gMarker = new google.maps.Marker({
          position: new google.maps.LatLng(marker.lat, marker.lng),
          title: marker.label,
        });

        gMarker.setMap(this.map);
        return gMarker;
      })
      .filter(m => !!m);
  };

  render() {
    const { height } = this.props;
    const mapContainerProps = {
      style: { height: `${height}px` },
    };

    return (
      <div className={s.container}>
        <div {...mapContainerProps} className={s.mapContainer} id="map" />
        <div className={s.loadingContainer}>
          {this.props.loadingLocations && <Spinner />}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Map);
