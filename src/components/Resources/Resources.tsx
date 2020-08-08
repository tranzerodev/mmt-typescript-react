import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Resource } from '../../store/data/types';
import { User } from '../../constants/dataTypes';
import ResourceItem from './ResourceItem';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
}));

export const Resources = ({
  resources,
  handleSelectTag,
  findOwner,
}: {
  resources: Resource[];
  handleSelectTag: (value: string) => void;
  findOwner: (email: string) => User | undefined;
}) => {
  const classes = useStyles();
  if (resources.length > 0) {
    return (
      <div className={classes.root}>
        {resources.map(resource => (
          <ResourceItem
            key={resource.id}
            resource={resource}
            handleSelectTag={handleSelectTag}
            findOwner={findOwner}
          />
        ))}
      </div>
    );
  }

  return <Typography variant="h5">Not found</Typography>;
};
