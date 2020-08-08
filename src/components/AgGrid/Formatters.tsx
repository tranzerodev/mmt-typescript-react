import React from 'react';

interface BooleanFormatterProps {
  value: boolean;
}

interface LocaleDateFormatterProps {
  value: string;
}

interface LocaleTimeFormatterProps {
  value: string;
}

interface NumberFormatterProps {
  value: number;
}

interface CurrencyFormatterProps {
  value: number;
}

interface SentenceCaseFormatterProps {
  value: string;
}

interface ImageFormatterProps {
  value: string[];
}

interface StatusFormatter {
  value: string;
}

export const StatusFormatter = (props: StatusFormatter): string =>
  props.value ? props.value.toUpperCase() : '';

export const BooleanFormatter = (props: BooleanFormatterProps) =>
  props.value ? 'Yes' : 'No';

interface TimestampFormatterProps {
  value: number;
}

export const TimestampFormatter = (props: TimestampFormatterProps) =>
  props.value ? new Date(props.value * 1000).toLocaleDateString() : '';

export const LocaleDateFormatter = (props: LocaleDateFormatterProps) =>
  props.value ? new Date(props.value).toLocaleDateString() : '';

export const LocaleTimeFormatter = (props: LocaleTimeFormatterProps) =>
  props.value ? new Date(props.value).toLocaleTimeString() : '';

export const SentenceCaseFormatter = (props: SentenceCaseFormatterProps) =>
  props.value && props.value.length
    ? props.value.charAt(0).toUpperCase() + props.value.substr(1)
    : '';

export const NumberFormatter = (props: NumberFormatterProps) =>
  Math.floor(props.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

export const CentsCurrencyFormatter = (props: CurrencyFormatterProps) =>
  `$${NumberFormatter({ value: props.value / 100 })}`;

export const CurrencyFormatter = (props: CurrencyFormatterProps) =>
  `$${NumberFormatter(props)}`;

export const ImageFormatter = ({ value }: ImageFormatterProps) => (
  <img src={value[0]} alt="Image1" />
);
