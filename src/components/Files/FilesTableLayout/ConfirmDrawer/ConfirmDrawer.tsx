import React from 'react';
import clsx from 'clsx';
import {
  Button,
  Drawer,
  Grid,
  Hidden,
  SvgIcon,
  Typography,
  makeStyles,
  Box,
} from '@material-ui/core';
import { Check as CheckIcon, Trash as TrashIcon } from 'react-feather';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  actionIcon: {
    marginRight: theme.spacing(1),
  },
}));

interface ConfirmationDrawer {
  className?: string;
  onDelete: () => void;
  onDownload: () => void;
  open: boolean;
  selected: number;
  selectedLabel?: string;
}

export const ConfirmationDrawer: React.FC<ConfirmationDrawer> = ({
  className = '',
  onDelete,
  onDownload,
  open,
  selected,
  selectedLabel = '',
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor="bottom"
      open={open}
      PaperProps={{ elevation: 1 }}
      variant="persistent"
    >
      <Box className={clsx(classes.root, className)} {...rest}>
        <Grid alignItems="center" container spacing={2}>
          <Hidden smDown>
            <Grid item md={3}>
              <Typography color="textSecondary" variant="subtitle1">
                {selected} {selectedLabel}{' '}
                {selectedLabel && selected > 1 ? "'s" : ''}
                selected
              </Typography>
            </Grid>
          </Hidden>
          <Grid item md={6} xs={12}>
            <Box className={classes.actions}>
              <Button onClick={onDownload}>
                <SvgIcon fontSize="small" className={classes.actionIcon}>
                  <CheckIcon />
                </SvgIcon>
                Download
              </Button>
              <Button onClick={onDelete}>
                <SvgIcon fontSize="small" className={classes.actionIcon}>
                  <TrashIcon />
                </SvgIcon>
                Delete
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};
