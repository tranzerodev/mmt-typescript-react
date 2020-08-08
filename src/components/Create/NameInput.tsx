import * as React from 'react';
import { TextField } from '@material-ui/core';

interface NameInputProps {
  htmlId: string;
  value: string;
  fieldName: string;
  label: string;
  onUpdate: (data: { [fieldName: string]: string }) => void;
}
const NameInput: React.FC<NameInputProps> = ({
  htmlId,
  value,
  fieldName,
  label,
  onUpdate,
}) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ [fieldName]: event.target.value });
  };

  return (
    <TextField
      id={htmlId}
      label={label}
      margin="normal"
      value={value}
      onChange={handleNameChange}
      fullWidth
    />
  );
};

export default NameInput;
