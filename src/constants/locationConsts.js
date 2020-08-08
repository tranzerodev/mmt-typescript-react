import PropTypes from 'prop-types';

export const LocationIdToObject = {};

const createLocation = (id, name, type, factor = 1, parents = [], options) => {
  const locationObj = { id, name, type, factor, parents, ...options };
  LocationIdToObject[id] = locationObj;
  return locationObj;
};

export const locationPropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.number,
  factor: PropTypes.number,
  parents: PropTypes.array,
  options: PropTypes.object,
});

const LOCATION_GROUP_TYPES = {
  REGION: 1,
  COUNTY: 2,
  CITY: 3,
  CUSTOM: 4,
};

export const getCustomLocation = id =>
  createLocation(id, 'Custom', LOCATION_GROUP_TYPES.CUSTOM);

export const allBayArea = createLocation(
  'sf_bay_area',
  'San Francisco Bay Area',
  LOCATION_GROUP_TYPES.REGION,
  4,
);
const sanFrancisco = createLocation(
  'san_francisco',
  'San Francisco',
  LOCATION_GROUP_TYPES.COUNTY,
  6,
  [allBayArea],
);
const santaClara = createLocation(
  'santa_clara',
  'Santa Clara',
  LOCATION_GROUP_TYPES.COUNTY,
  3,
  [allBayArea],
);
const alameda = createLocation(
  'alameda',
  'Alameda',
  LOCATION_GROUP_TYPES.COUNTY,
  3,
  [allBayArea],
);
createLocation('san_mateo', 'San Mateo', LOCATION_GROUP_TYPES.COUNTY, 3, [
  allBayArea,
]);
createLocation('marin', 'Marin', LOCATION_GROUP_TYPES.COUNTY, 2, [allBayArea]);
createLocation('contra_costa', 'Contra Costa', LOCATION_GROUP_TYPES.COUNTY, 2, [
  allBayArea,
]);
createLocation('berkeley', 'Berkeley', LOCATION_GROUP_TYPES.CITY, 4, [
  allBayArea,
  alameda,
]);
createLocation('oakland', 'Oakland', LOCATION_GROUP_TYPES.CITY, 4, [
  allBayArea,
  alameda,
]);
createLocation('san_jose', 'San Jose', LOCATION_GROUP_TYPES.CITY, 4, [
  allBayArea,
  santaClara,
]);
createLocation(
  'tech_central',
  'Tech Central',
  LOCATION_GROUP_TYPES.CUSTOM,
  15,
  [allBayArea],
  {
    description: `Tech central covers the areas in the SF Bay
    Area with the highest concentration of technology startups
    and established technology companies including several neighborhoods
    in San Francisco (SoMa, South Beach, Mission, Rincon Hill, FiDi),
    Palo Alto, Menlo Park, and Mountain View.`,
  },
);

const createLocationGroup = (type, groupName, locations) => ({
  type,
  groupName,
  locations:
    locations || Object.values(LocationIdToObject).filter(l => l.type === type),
});

export const locationGroupPropType = PropTypes.shape({
  type: PropTypes.number,
  groupName: PropTypes.string,
  locations: PropTypes.arrayOf(locationPropType),
});

export const LOCATION_GROUPS = [
  createLocationGroup(LOCATION_GROUP_TYPES.REGION, 'Regions'),
  createLocationGroup(LOCATION_GROUP_TYPES.COUNTY, 'Counties'),
  createLocationGroup(LOCATION_GROUP_TYPES.CITY, 'Cities'),
  createLocationGroup(LOCATION_GROUP_TYPES.CUSTOM, 'Custom'),
];

export const PACKAGE_LOCATION_GROUPS = [
  createLocationGroup(LOCATION_GROUP_TYPES.CUSTOM, null, [
    allBayArea,
    sanFrancisco,
  ]),
];

const LocationGroupCategories = {
  ALL: LOCATION_GROUPS,
  PACKAGE: PACKAGE_LOCATION_GROUPS,
};

export default LocationGroupCategories;
