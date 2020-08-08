import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from '@material-ui/core';
import ModalButton from '../Modals/ModalButton';

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      width: '336px',
      marginBottom: '10px',
      marginLeft: '8px',
      marginRight: '8px',
    },
    cardHeader: {
      padding: '10px',
    },
    cardContent: {
      height: '88px',
      overflowY: 'auto',
      padding: '10px',
    },
    checkbox: {
      marginLeft: 'auto',
    },
    cardActions: {
      'flex-direction': 'column',
      'align-items': 'flex-end',
      padding: '10px',
    },
  }),
);

type PerformanceCardPropType = {
  title: string;
  description: string;
  isSelected: boolean;
  toggleModule: () => void;
  requiresSetup: boolean;
  setupComponent: React.ReactElement;
};

const PerformanceCard: React.FC<PerformanceCardPropType> = ({
  title,
  description,
  isSelected,
  toggleModule,
  requiresSetup = false,
  setupComponent = null,
}) => {
  const classes = useStyles();

  return (
    <Card classes={{ root: classes.card }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: 'h4' }}
        classes={{ root: classes.cardHeader }}
      />
      <CardContent classes={{ root: classes.cardContent }}>
        {description}
      </CardContent>
      <CardActions disableSpacing classes={{ root: classes.cardActions }}>
        {setupComponent && (
          <ModalButton
            label="perf-module-setup-modal"
            description="Setup Performance Module"
            title={title}
            mainComponent={setupComponent || 'Enter information for setup.'}
            completeButtonText="Save"
            text={requiresSetup ? 'Connect' : 'Edit'}
            variant="text"
            color="primary"
            authRequired
          />
        )}
        {!requiresSetup && (
          <Checkbox
            classes={{ root: classes.checkbox }}
            color="primary"
            checked={isSelected}
            onChange={toggleModule}
            value={title}
            inputProps={{
              'aria-label': `${title} performance card checkbox`,
            }}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default PerformanceCard;
