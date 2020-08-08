import React from 'react';
import NumberFormat from 'react-number-format';
import { InputBaseComponentProps } from '@material-ui/core/InputBase';

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { value: string; name: string } }) => void;
  defaultValue?: string | number;
}

function CurrencyNumberFormat(
  props: InputBaseComponentProps & NumberFormatCustomProps,
) {
  const { inputRef, name, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
            name,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

export default CurrencyNumberFormat;
