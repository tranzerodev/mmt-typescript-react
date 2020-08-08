import * as React from 'react';
import { FormControl } from '@material-ui/core';
import ComboBox from '../Select/ComboBox';
import RegionOptions from './RegionOptions';

type RegionItemType = {
  id: string;
};

interface RegionsSelectProps {
  values: string[];
  fieldName: string;
  onUpdate: (data: { [fieldName: string]: string[] }) => void;
}
const RegionsSelect: React.FC<RegionsSelectProps> = ({
  values,
  fieldName,
  onUpdate,
}) => {
  const handleRegionsChange = (
    _: React.ChangeEvent<{}>,
    vals: RegionItemType[],
  ) => {
    onUpdate({ [fieldName]: vals.map(v => v.id) });
  };

  return (
    <FormControl margin="normal" fullWidth>
      <ComboBox
        id="region-select"
        label="Regions"
        options={RegionOptions}
        values={values}
        onChange={handleRegionsChange}
      />
    </FormControl>
  );
};

export default RegionsSelect;
