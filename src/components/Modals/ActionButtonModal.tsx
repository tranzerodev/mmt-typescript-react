import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Divider,
  Button,
  Theme,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 700,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  cardContent: {
    padding: 24,
  },
  container: {
    marginTop: theme.spacing(3),
    height: 200,
  },
  modalBody: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  actions: {
    justifyContent: 'flex-end',
  },
}));

export type ActionButtonModalPropType = {
  label: string;
  description?: string;
  onClose: () => void;
  title?: string;
  mainComponent?: React.ReactElement | string;
  footerComponent?: React.ElementType;
  showSpinner?: boolean;
  positiveAction?: boolean;
  positiveActionText?: string;
  cancelActionText?: string;
  onPositiveActionPerformed: () => void;
  open: boolean;
};

const ActionButtonModal: React.FC<ActionButtonModalPropType> = ({
  label,
  onClose,
  description = 'Modal',
  title = null,
  mainComponent = null,
  positiveAction = false,
  positiveActionText = null,
  cancelActionText = 'Dismiss',
  onPositiveActionPerformed,
  ...modalProps
}) => {
  const classes = useStyles();
  return (
    <Modal
      aria-labelledby={label}
      aria-describedby={description}
      onClose={onClose}
      {...modalProps}
    >
      <Card className={clsx(classes.root)}>
        <CardHeader title={title} />
        <Divider />
        <CardContent classes={{ root: classes.cardContent }}>
          <Typography variant="body1" component="span">
            {mainComponent}
          </Typography>
        </CardContent>
        <Divider />
        <CardActions className={clsx(classes.actions)}>
          <Button
            onClick={onClose}
            color="primary"
            variant={positiveAction ? 'text' : 'contained'}
            id="action-button-modal-dismiss"
          >
            {cancelActionText}
          </Button>
          {positiveAction && (
            <Button
              onClick={onPositiveActionPerformed}
              color="primary"
              variant="contained"
              id="action-button-modal-positive-action"
            >
              {positiveActionText}
            </Button>
          )}
          {/* {modalActions} */}
        </CardActions>
      </Card>
    </Modal>
  );
};

export default ActionButtonModal;
