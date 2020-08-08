import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1',
      padding: 0,
      minWidth: '220px',
    },
    selected: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    full: {
      height: '100%',
      padding: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    details: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: theme.spacing(2),
    },
    avatar: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.main,
      fontWeight: 500,
      height: 48,
      width: 48,
    },
    title: {
      position: 'absolute',
      top: theme.spacing(2),
    },
  }),
);

type SummaryProps = {
  title: string;
  value: string;
  icon: JSX.Element;
  isSelected: boolean;
  onClickSummary: () => void;
};

const millions = 1000000;
const thousands = 1000;

const MetricSummary: React.FC<SummaryProps> = props => {
  const classes = useStyles();
  const { onClickSummary, isSelected, value, title, icon } = props;

  const renderValue = (input: string) => {
    const val = parseFloat(input);
    if (val > millions) {
      return `${(val / millions).toFixed(2)} MM`;
    }
    if (val > thousands) {
      return `${(val / thousands).toFixed(2)} K`;
    }

    return val.toFixed(0);
  };

  return (
    <Card
      className={classNames(classes.root, isSelected && classes.selected)}
      onClick={onClickSummary}
    >
      <CardActionArea className={classes.full}>
        <div className={classes.details}>
          <Typography color="inherit" variant="h3">
            {renderValue(value)}
          </Typography>
        </div>
        <Avatar className={classes.avatar}>{icon}</Avatar>
        <Typography
          color="inherit"
          component="h3"
          gutterBottom
          variant="overline"
          className={classes.title}
        >
          {title}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default MetricSummary;
