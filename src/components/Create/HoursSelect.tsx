import * as React from 'react';
import {
  FormControl,
  Typography,
  Box,
  Slider,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import { roundByValue, abbreviateNumber } from '../../data/utils/formatUtils';

const useStyles = makeStyles(() =>
  createStyles({
    markLabel: {
      transform: 'translateX(-96%)',
    },
  }),
);

interface HoursSelectProps {
  fieldName: string;
  selectedHours: number;
  availableHours: number;
  totalHours: number;
  onUpdate: (data: { [fieldName: string]: number | number[] }) => void;
}
const HoursSelect: React.FC<HoursSelectProps> = ({
  fieldName,
  selectedHours,
  availableHours,
  totalHours,
  onUpdate,
}) => {
  const classes = useStyles();

  const handleHoursChange = (
    event: React.ChangeEvent<{}>,
    value: number | number[],
  ) => {
    event.preventDefault();
    const hours = Array.isArray(value) ? value : [value];
    const validatedValue = Math.min(availableHours, ...hours);
    const parsedValue =
      validatedValue === availableHours
        ? validatedValue
        : roundByValue(validatedValue);
    onUpdate({ [fieldName]: parsedValue });
  };

  const marks = [
    {
      value: availableHours,
      label: `Available`,
    },
  ];

  if (totalHours > availableHours) {
    marks.push({
      value: totalHours,
      label: `Total`,
    });
  }

  return (
    <FormControl margin="normal" fullWidth>
      <Typography variant="h5" id="hours-slider" gutterBottom>
        Hours
      </Typography>
      <Box marginTop="32px">
        <Slider
          classes={{ markLabel: classes.markLabel }}
          value={selectedHours}
          marks={marks.filter(m => m.value !== 0)}
          max={totalHours}
          aria-labelledby="hours-slider"
          valueLabelFormat={() => abbreviateNumber(selectedHours, false)}
          onChange={handleHoursChange}
          valueLabelDisplay="on"
        />
      </Box>
      <Typography variant="body2" gutterBottom>
        Hours can be set after you&apos;ve chosen endpoints and set a budget
        above
      </Typography>
    </FormControl>
  );
};

export default HoursSelect;
