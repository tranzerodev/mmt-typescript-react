import * as React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import ClientOptions from './ClientOptions';

export const AllClientSelectValue = 'default';

interface ClientSelectProps {
  selectedClient: string;
  fieldName: string;
  onUpdate: (data: { [fieldName: string]: string }) => void;
}
const ClientSelect: React.FC<ClientSelectProps> = ({
  selectedClient,
  fieldName,
  onUpdate,
}) => {
  const handleClientChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    onUpdate({ [fieldName]: value });
  };

  return (
    <FormControl margin="normal" fullWidth>
      <InputLabel id="select-cutomer-label">Client</InputLabel>
      <Select
        labelId="select-cutomer-label"
        value={selectedClient}
        onChange={handleClientChange}
      >
        <MenuItem value={AllClientSelectValue}>All</MenuItem>
        {ClientOptions.map(c => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ClientSelect;
