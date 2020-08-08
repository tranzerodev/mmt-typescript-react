/* global google */
import { MaxRadiusMeters, MinRadiusMeters } from '../constants/packageConsts';

const geohash = require('ngeohash');

export default class LocationUtils {
  /**
   * Calculate the center/average of multiple GeoLocation coordinates
   * Expects an array of objects with .latitude and .longitude properties
   *
   * @url http://stackoverflow.com/a/14231286/538646
   */
  static averageGeolocation(coords) {
    if (coords.length === 1) {
      return coords[0];
    }

    let x = 0.0;
    let y = 0.0;
    let z = 0.0;

    coords.forEach(coord => {
      const latitude = (coord.latitude * Math.PI) / 180;
      const longitude = (coord.longitude * Math.PI) / 180;

      x += Math.cos(latitude) * Math.cos(longitude);
      y += Math.cos(latitude) * Math.sin(longitude);
      z += Math.sin(latitude);
    });

    const total = coords.length;

    x /= total;
    y /= total;
    z /= total;

    const centralLongitude = Math.atan2(y, x);
    const centralSquareRoot = Math.sqrt(x * x + y * y);
    const centralLatitude = Math.atan2(z, centralSquareRoot);

    return {
      latitude: (centralLatitude * 180) / Math.PI,
      longitude: (centralLongitude * 180) / Math.PI,
    };
  }

  static processPoints(geometry, callback, thisArg) {
    if (geometry instanceof google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
      callback.call(thisArg, geometry.get());
    } else {
      geometry.getArray().forEach(g => {
        this.processPoints(g, callback, thisArg);
      });
    }
  }

  static getMinimumBoundingRectangle(googleMapsCircle) {
    const bounds = googleMapsCircle.getBounds();
    return this.getArrayFromBounds(bounds);
  }

  static getMinimumBoundingRectangleFromGeoJson(geoDataUrl) {
    const mapsData = new google.maps.Data();
    const bounds = new google.maps.LatLngBounds();
    return new Promise(resolve => {
      mapsData.loadGeoJson(geoDataUrl, null, features => {
        features.forEach(feature => {
          this.processPoints(feature.getGeometry(), bounds.extend, bounds);
        });
        resolve(LocationUtils.getArrayFromBounds(bounds));
      });
    });
  }

  static getItemFromBounds(bounds) {
    const northEastCoords = bounds.getNorthEast();
    const southWestCoords = bounds.getSouthWest();
    return {
      bottomLat: southWestCoords.lat(),
      topLat: northEastCoords.lat(),
      leftLng: southWestCoords.lng(),
      rightLng: northEastCoords.lng(),
    };
  }

  static getArrayFromBounds(bounds) {
    const maxCoords = bounds.getNorthEast();
    const minCoords = bounds.getSouthWest();

    // format array as: [minlat, minlon, maxlat, maxlon]
    return [minCoords.lat(), minCoords.lng(), maxCoords.lat(), maxCoords.lng()];
  }

  static getBaseGeoHashes(packageItem) {
    const mBr = this.getPackageMBR(packageItem, MinRadiusMeters);
    return LocationUtils.getGeoHashes(mBr);
  }

  // packageBounds is array like [minlat, minlon, maxlat, maxlon]
  static getGeoHashes(packageBounds) {
    if (!packageBounds) {
      return [];
    }

    return geohash.bboxes(...packageBounds, 6);
  }

  static async getLocationMBR(locationName) {
    return LocationUtils.getMinimumBoundingRectangleFromGeoJson(
      this.getGeoJsonUrl(locationName),
    );
  }

  static async getPackageMBR(packageItem, radius) {
    const { Latitude, Longitude, LocationName } = packageItem;
    if (LocationName) {
      return this.getLocationMBR(LocationName);
    }

    return LocationUtils.getMinimumBoundingRectangle(
      new google.maps.Circle({
        center: { lat: Latitude, lng: Longitude },
        radius: radius || MaxRadiusMeters,
      }),
    );
  }

  static getGeoJsonUrl(locId) {
    const baseGeoJsonUrl =
      'https://s3-us-west-2.amazonaws.com/lightout-data/locations';

    if (locId.startsWith('dma_')) {
      const dma = locId.split('dma_')[1];
      return `${baseGeoJsonUrl}/dmas/${dma}.json`;
    }

    if (typeof locId === 'number') {
      return `${baseGeoJsonUrl}/zipcodes/${locId}.json`;
    }

    return `${baseGeoJsonUrl}/california/${locId}.json`;
  }
}
