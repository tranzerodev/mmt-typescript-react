import React from 'react';

import {
  makeStyles,
  createStyles,
  Box,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core';
import clsx from 'clsx';
import UserAvatar from '../../User/UserAvatar';
import { ProfileForm } from './ProfileForm';

interface ProfileProps {
  className?: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    cardContent: {
      '&:last-child': {
        paddingBottom: 10,
      },
    },
  }),
);

export const Profile: React.FC<ProfileProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={4} md={6} xl={3} xs={12}>
        <Card>
          <CardContent className={classes.cardContent}>
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              textAlign="center"
            >
              <UserAvatar
                type="column"
                showName
                nameSize="h3"
                avatarSize="large"
                showTime
                showAddress
                uploader
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={8} md={6} xl={9} xs={12}>
        <ProfileForm />
      </Grid>
    </Grid>
  );
};
