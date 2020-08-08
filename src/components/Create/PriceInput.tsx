import * as React from 'react';
import { TextField } from '@material-ui/core';
import CurrencyNumberFormat from '../Inputs/NumberFormat';

interface PriceInputProps {
  htmlId: string;
  price: number;
  fieldName: string;
  onUpdate: (data: { [fieldName: string]: number }) => void;
}
const PriceInput: React.FC<PriceInputProps> = ({
  htmlId,
  price,
  fieldName,
  onUpdate,
}) => {
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ [fieldName]: parseInt(event.target.value, 0) });
  };

  return (
    <TextField
      id={htmlId}
      label="Price"
      value={price}
      onChange={handlePriceChange}
      InputProps={{
        inputComponent: CurrencyNumberFormat as any,
      }}
      margin="normal"
      fullWidth
    />
  );
};

export default PriceInput;
