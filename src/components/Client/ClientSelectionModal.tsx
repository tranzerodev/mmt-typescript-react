import React, { useState } from 'react';
import { Dialog, Box, Button, makeStyles, Typography } from '@material-ui/core';
import CompanySelection from './CompanySelection';

const useStyles = makeStyles(theme => ({
  root: {},
  confirmButton: {
    marginLeft: theme.spacing(2),
  },
}));

interface ClientModalProps {
  open: boolean;
  onSelect: (payload: string) => void;
  onCancel: () => void;
}

interface ClientModel {
  Client: string;
}

const ClientSelectionModal: React.FC<ClientModalProps> = props => {
  const { onCancel, onSelect, open, ...rest } = props;

  const [currentClientId, setCurrentClientId] = useState('');

  const classes = useStyles();

  const handleClientUpdate = (data: ClientModel) => {
    if (data && data.Client) {
      setCurrentClientId(data.Client);
    }
  };

  const handleSelectClient = () => {
    onSelect(currentClientId);
  };

  return (
    <Dialog maxWidth="sm" fullWidth onClose={onCancel} open={open} {...rest}>
      {open && (
        <Box p={2} pt={4}>
          <Typography
            align="center"
            gutterBottom
            variant="h3"
            color="textPrimary"
          >
            Choose Client
          </Typography>
          <CompanySelection
            onUpdate={handleClientUpdate}
            fieldName="Client"
            labelValue="Client"
          />
          <Box py={2} display="flex" alignItems="center">
            <Box flexGrow={1} />
            <Button onClick={onCancel}>Dismiss</Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.confirmButton}
              onClick={handleSelectClient}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default ClientSelectionModal;
