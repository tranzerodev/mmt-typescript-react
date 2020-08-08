export default function numberWithCommas(x: string) {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '';
}

export function roundByValue(value: number): number {
  if (value === 0 || !value) {
    return 0;
  }

  if (value > 1000000) {
    return Math.round(value / 100000) * 100000;
  }

  if (value > 100) {
    return Math.round(value / 100) * 100;
  }

  return value;
}

export function abbreviateNumber(value: number, round = true) {
  let suffix = '';
  let parsedValue = value;
  if (value === 0 || !value) {
    parsedValue = 0;
  } else if (value > 1000000) {
    suffix = 'M';
    parsedValue = Math.round(value / 10000) / 100;
  } else if (value > 1000) {
    suffix = 'K';
    parsedValue = Math.round(value / 1000);
  }

  return `${parsedValue}${suffix}`;
}
