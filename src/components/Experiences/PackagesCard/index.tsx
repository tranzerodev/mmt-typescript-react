import React, { useContext } from 'react';

import {
  makeStyles,
  createStyles,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { Package } from '../../../store/packages/types';

// TODO: remove ts-ignore after ui.js will be converted into ui.ts
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import { openAuthModal } from '../../../store/ui/actions';
import { AUTH_STATES } from '../../../constants/authConsts';
import history from '../../../history';
import { RouteContext } from '../../../context';

const useStyles = makeStyles(() =>
  createStyles({
    cardBox: {
      width: '387px',
      height: '387px',
      '@media (max-width: 599px)': {
        width: '230px',
        height: '230px',
      },
    },
    cardMedia: {
      pointerEvents: 'none',
    },
    cardActionArea: {
      position: 'relative',
      height: '100%',
    },
    cardName: {
      position: 'absolute',
      top: '20px',
      backgroundColor: '#fff',
      padding: '22px 10px',
      fontSize: '18px',
    },
    card: {
      height: '100%',
      borderRadius: '0',
    },
  }),
);

const PackagesCard = (props: Package) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { isMobile } = useContext(RouteContext);
  const { name, id } = props;

  const handleExperienceSelected = (experienceId: string) => {
    if (isMobile) {
      dispatch(openAuthModal(AUTH_STATES.DESKTOP_ONLY_MODAL));
    } else {
      // TODO: we need to fix this place
      // history could be undefined
      /* eslint-disable @typescript-eslint/ban-ts-ignore */
      // @ts-ignore
      history.push(`/package?id=${experienceId}`);
    }

    return null;
  };

  const getPreviewUrl = (packageItem: Package) => {
    if (packageItem.imagesPrimary && packageItem.imagesPrimary.length > 0) {
      const imageObj = packageItem.imagesPrimary[0];
      const { url, thumbnails } = imageObj;
      let previewUrl = url;
      if (thumbnails && thumbnails.large) {
        previewUrl = thumbnails.large.url;
      }

      return previewUrl;
    }

    return '';
  };

  return (
    <Box className={classes.cardBox}>
      <Card className={classes.card}>
        <CardActionArea
          className={classes.cardActionArea}
          onClick={() => handleExperienceSelected(id)}
        >
          <CardMedia
            className={classes.cardMedia}
            component="img"
            alt="Contemplative Reptile"
            height="387"
            image={getPreviewUrl(props)}
            title={name}
          />
          <Typography className={classes.cardName} variant="h4">
            {name}
          </Typography>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default PackagesCard;
