import * as React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import SectionOptions from './SectionOptions';
import { AllClientSelectValue } from './ClientSelect';

interface ClientSelectProps {
  selectedSection: string;
  selectedClient: string;
  fieldName: string;
  onUpdate: (data: { [fieldName: string]: string }) => void;
}
const SectionSelect: React.FC<ClientSelectProps> = ({
  htmlId,
  selectedSection,
  selectedClient,
  fieldName,
  onUpdate,
}) => {
  const [isDisabled, setDisabled] = React.useState(
    selectedClient !== AllClientSelectValue,
  );
  const hintMessage =
    'This Package will be shown only to the selected client in the For You section';

  const handleSectionChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const value = event.target.value as string;
    onUpdate({ [fieldName]: value });
  };

  React.useEffect(() => {
    if (selectedClient === AllClientSelectValue) {
      setDisabled(false);
      onUpdate({ [fieldName]: SectionOptions[1] });
    } else {
      setDisabled(true);
      onUpdate({ [fieldName]: SectionOptions[0] });
    }
  }, [selectedClient]);

  return (
    <FormControl margin="normal" fullWidth disabled={isDisabled}>
      <InputLabel id="select-section-label">
        {isDisabled ? hintMessage : 'Section'}
      </InputLabel>
      <Select
        labelId="select-section-label"
        value={selectedSection}
        onChange={handleSectionChange}
        id={htmlId}
      >
        {SectionOptions.map(c => (
          <MenuItem key={c} value={c} disabled={c === SectionOptions[0]}>
            {c}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SectionSelect;
