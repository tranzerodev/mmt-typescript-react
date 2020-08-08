import React, { useEffect, useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import { Alert } from '@material-ui/lab';
import * as ReduxType from '../../store/reduxTypes';
import { ERROR, SUCCESS, INFO, WARNING } from '../../store/ui/types';

const mapStateToProps = (state: ReduxType.RootState) => ({
  alertMessageType: state.ui.alertMessageType,
  alertMessage: state.ui.alertMessage,
  loadedPackages: state.packages.loadedPackages,
});

const connector = connect(
  mapStateToProps,
  null,
);

type SeverityType = 'success' | 'info' | 'warning' | 'error' | undefined;

type PropsFromRedux = ConnectedProps<typeof connector>;

const AlertSnackbar: React.FC<PropsFromRedux> = props => {
  const { alertMessageType, alertMessage } = props;
  const [alertType, setAlertType] = useState<SeverityType>('info');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    switch (alertMessageType) {
      case ERROR:
        setAlertType('error');
        break;
      case WARNING:
        setAlertType('warning');
        break;
      case INFO:
        setAlertType('info');
        break;
      case SUCCESS:
        setAlertType('success');
        break;
      default:
        setAlertType('error');
    }
    if (alertMessage) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [alertMessageType, alertMessage]);

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={2500}
        onClose={handleClose}
      >
        <Alert severity={alertType} onClose={handleClose}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default connector(AlertSnackbar);
