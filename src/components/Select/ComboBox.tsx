import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type ComboBoxOption = {
  label: string;
  id: string;
};

interface ComboBoxProps {
  id: string;
  label: string;
  limit: number | undefined;
  options: ComboBoxOption[];
  onChange: (event: React.ChangeEvent<{}>, value: any) => void;
  values: any[];
}

const ComboBox = ({
  id,
  label,
  limit = 5,
  options,
  values,
  onChange,
}: ComboBoxProps) => (
  <Autocomplete
    multiple
    id={id}
    options={options}
    value={options.filter((option: ComboBoxOption) =>
      values.includes(option.id),
    )}
    limit={limit}
    onChange={onChange}
    disableCloseOnSelect
    getOptionLabel={option => option.label}
    getOptionSelected={(option: ComboBoxOption) => values.includes(option.id)}
    renderOption={(option, { selected }) => (
      <>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selected}
        />
        {option.label}
      </>
    )}
    renderInput={params => (
      <TextField
        {...params}
        label={label}
        placeholder={`Choose ${label}`}
        margin="normal"
        fullWidth
      />
    )}
  />
);

export default ComboBox;
