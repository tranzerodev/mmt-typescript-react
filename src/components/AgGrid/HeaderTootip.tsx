import React from 'react';
import { makeStyles, createStyles, Box } from '@material-ui/core';

interface HeaderTooltipProps {
  description: string[] | string;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      borderRadius: '8px',
      width: '400px',
      padding: '4px 8px',
      fontSize: '14px',
    },
  }),
);

const HeaderTooltip: React.FC<HeaderTooltipProps> = props => {
  const { description } = props;

  const classes = useStyles();
  return (
    <>
      <Box className={classes.root}>
        {typeof description === 'object' &&
          description.length &&
          description.map((item: string) => (
            <Box p={1} key={item}>
              {item}
            </Box>
          ))}
        {typeof description === 'string' && <Box p={1}>{description}</Box>}
      </Box>
    </>
  );
};

export default HeaderTooltip;
