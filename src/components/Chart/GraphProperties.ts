const fontSize = { fontSize: 16 };

export const yAxisStyle = {
  text: fontSize,
  title: fontSize,
};

export const xAxisStyle = {
  text: { fontSize: 12 },
  title: fontSize,
};

export const scaleYValues = (value: string) => {
  if (Number(value) > 1000000) {
    return `${Number(value) / 1000000}MM`;
  }

  if (Number(value) > 1000) {
    return `${Number(value) / 1000}k`;
  }

  return value;
};
