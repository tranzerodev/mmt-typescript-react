import React from 'react';
import { Dialog, Box, Button, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  confirmButton: {
    marginLeft: theme.spacing(2),
  },
}));

interface ClientModalProps {
  open: boolean;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ClientModalProps> = props => {
  const { title, message, onConfirm, open, ...rest } = props;

  const classes = useStyles();

  return (
    <Dialog maxWidth="sm" fullWidth onClose={onConfirm} open={open} {...rest}>
      {open && (
        <Box p={2} pt={4}>
          <Typography
            align="center"
            gutterBottom
            variant="h3"
            color="textPrimary"
          >
            {title}
          </Typography>
          <Typography align="left" variant="h5" color="textPrimary">
            {message}
          </Typography>

          <Box pt={2} display="flex" alignItems="center">
            <Box flexGrow={1} />
            <Button
              variant="contained"
              color="primary"
              className={classes.confirmButton}
              onClick={onConfirm}
            >
              Ok
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default ConfirmModal;
