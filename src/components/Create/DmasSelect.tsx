import * as React from 'react';
import { FormControl } from '@material-ui/core';
import ComboBox from '../Select/ComboBox';
import * as DataType from '../../constants/dataTypes';

interface DmasSelectProps {
  dmaOptions: DataType.DmaModel[];
  values: string[];
  fieldName: string;
  onUpdate: (data: { [fieldName: string]: string[] }) => void;
}
const DmasSelect: React.FC<DmasSelectProps> = ({
  dmaOptions,
  values,
  fieldName,
  onUpdate,
}) => {
  const handleDMAsChange = (_: React.ChangeEvent<{}>, vals: any[]) => {
    onUpdate({ [fieldName]: vals.map(v => v.id) });
  };

  return (
    <FormControl margin="normal" fullWidth>
      <ComboBox
        id="dma-select"
        label="DMAs"
        options={dmaOptions.map(
          ({ id, name, disabled }: DataType.DmaModel) => ({
            id,
            label: name,
            disabled,
          }),
        )}
        values={values}
        onChange={handleDMAsChange}
      />
    </FormControl>
  );
};

export default DmasSelect;
