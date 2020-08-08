import * as React from 'react';
import { FormControl } from '@material-ui/core';
import ComboBox from '../Select/ComboBox';
import PerformanceCardData from '../../constants/performanceConsts';

type CampaignValue = {
  id: string;
};

interface PerfModulesSelectProps {
  entityType: string;
  values: string[];
  fieldName: string;
  onUpdate: (data: { [fieldName: string]: string[] | CampaignValue[] }) => void;
}
const PerfModulesSelect: React.FC<PerfModulesSelectProps> = ({
  entityType,
  values,
  fieldName,
  onUpdate,
}) => {
  const handlePMoudlesChange = (_: React.ChangeEvent<{}>, vals: any[]) => {
    onUpdate({
      [fieldName]: vals.map(v =>
        entityType === 'package' ? v.id : { id: v.id },
      ),
    });
  };

  return (
    <FormControl margin="normal" fullWidth>
      <ComboBox
        id="performance-select"
        label="Performance Modules"
        options={PerformanceCardData.map(({ id, title }) => ({
          id,
          label: title,
        }))}
        values={values}
        onChange={handlePMoudlesChange}
      />
    </FormControl>
  );
};

export default PerfModulesSelect;
