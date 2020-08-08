import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles(theme => ({
  item: {
    minWidth: 150,
    display: 'inline-block',
    margin: theme.spacing(1),
    cursor: 'pointer',
    '&:first-child': {
      marginLeft: 0,
    },
  },
  root: {
    marginTop: theme.spacing(1),
  },
  title: {
    textAlign: 'center',
    color: theme.palette.common.black,
  },
  selected: {
    backgroundColor: theme.palette.primary.main,
    '& $title': {
      color: theme.palette.common.white,
    },
  },
  content: {
    backgroundColor: fade(theme.palette.primary.main, 0.05),
    padding: theme.spacing(1.25, 2),
    borderRadius: theme.spacing(0.5),
    '&:last-child': {
      paddingBottom: theme.spacing(1.25),
    },
  },
}));

export default function Tags({
  tags,
  handleSelectTag,
  selectedTag,
}: {
  tags: string[];
  handleSelectTag: (value: string) => void;
  selectedTag: string;
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {tags.map(tag => (
        <Card
          className={`${classes.item} ${
            selectedTag === tag ? classes.selected : ''
          }`}
          key={tag}
          onClick={() => handleSelectTag(tag)}
        >
          <CardContent className={classes.content}>
            <Typography className={classes.title} variant="body1">
              {tag
                .split('_')
                .join(' ')
                .toLocaleUpperCase()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
