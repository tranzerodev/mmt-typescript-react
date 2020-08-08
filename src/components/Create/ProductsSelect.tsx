import * as React from 'react';
import { FormControl } from '@material-ui/core';
import ComboBox from '../Select/ComboBox';
import { EndpointTypes } from '../../store/options/types';

interface ProductsSelectProps {
  productOptions: EndpointTypes[];
  values: string[];
  fieldName: string;
  isMoving: boolean;
  onUpdate: (data: { [fieldName: string]: string[] }) => void;
}
const ProductsSelect: React.FC<ProductsSelectProps> = ({
  productOptions,
  values,
  fieldName,
  isMoving,
  onUpdate,
}) => {
  const handleProductsChange = (_: React.ChangeEvent<{}>, vals: any[]) => {
    onUpdate({ [fieldName]: vals.map(v => v.id) });
  };

  const productOptionsRenderer = productOptions.map(
    ({ id, Name, 'Endpoint Category': categories = [] }: EndpointTypes) => ({
      id,
      label: Name,
      disabled: isMoving
        ? !categories.includes('Transit - Car Fins')
        : categories.includes('Transit - Car Fins'),
    }),
  );

  return (
    <FormControl margin="normal" fullWidth>
      <ComboBox
        id="product-select"
        label="Products"
        options={productOptionsRenderer}
        values={values}
        onChange={handleProductsChange}
      />
    </FormControl>
  );
};

export default ProductsSelect;
