import React from 'react';
import {
  CardHeader,
  Button,
  makeStyles,
  createStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    cardHeader: {
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
    cardAction: {
      margin: 0,
    },
  }),
);

interface FormHeaderProps {
  title: string;
  includeSubmit: boolean;
  submitEnabled: boolean;
  submitText?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  includeSubmit,
  submitEnabled,
  submitText = 'Save',
}) => {
  const classes = useStyles();

  return includeSubmit ? (
    <CardHeader
      classes={{ root: classes.cardHeader, action: classes.cardAction }}
      title={title}
      action={
        <Button type="submit" disabled={!submitEnabled}>
          {submitText}
        </Button>
      }
    />
  ) : (
    <CardHeader title={title} />
  );
};

export default FormHeader;
