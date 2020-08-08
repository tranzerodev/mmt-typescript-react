export const PackageEventTypes = {
  conference: { value: 'conference', label: 'Conference' },
  concert: { value: 'concert', label: 'Concert' },
  holiday: { value: 'holiday', label: 'Holiday' },
};

export const DefaultStartingPrice = 1000;

export const MinDurationWeeks = '2';
export const DefaultDurationWeeks = '4';

// maxRadius * metersPerMile
const metersPerMile = 1609.34;
export const MinRadiusMeters = 3 * metersPerMile;
export const MaxRadiusMeters = 7 * metersPerMile;

export const DurationOptions = [
  { value: '2', label: '2 Weeks', style: { flexGrow: 1 } },
  { value: '4', label: '1 Month', style: { flexGrow: 1 } },
  { value: '8', label: '2 Months', style: { flexGrow: 2 } },
];
