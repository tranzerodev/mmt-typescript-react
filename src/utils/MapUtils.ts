import { useLoadScript } from '@react-google-maps/api';

const libraries = ['visualization', 'places'];

export const loadMapScript = () =>
  useLoadScript({
    googleMapsApiKey: 'AIzaSyBeEpL9aBgB2j8uuAH_yZjRYiK26v9HMIo',
    libraries,
  });
