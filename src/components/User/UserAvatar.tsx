import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createStyles,
  Theme,
  makeStyles,
  ButtonBase,
  IconButton,
  Hidden,
  Avatar,
  Typography,
  Box,
  Button,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { RootState } from '../../store/reduxTypes';
import { UserState as User } from '../../store/user/types';
import { getInitials } from '../../utils/UserUtils';
import { updateUserAttributes } from '../../store/user/actions';
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import { S3Utils } from '../../utils';

interface ColumnAvatarProps {
  avatarUrl?: string;
  name?: string;
  description?: string;
}
interface UserAvatarProps extends ColumnAvatarProps {
  type?: 'row' | 'rowButton' | 'column' | 'image';
  onClick?: any;
  showName?: boolean;
  nameSize?: 'h6' | 'h5' | 'h3';
  showTime?: boolean;
  showEmail?: boolean;
  avatarSize?: 'small' | 'medium' | 'large' | 'regular';
  showAddress?: boolean;
  uploader?: boolean;
}

interface Model {
  user: User;
}

interface UploadResponse {
  ETag?: string;
  Location?: string;
  key?: string;
  Key?: string;
  Bucket?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    authButton: {
      marginLeft: theme.spacing(1),
      color: theme.palette.primary.contrastText,
      padding: '4px',
    },
    avatarContainer: {},
    avatarSmall: {
      height: 40,
      width: 40,
    },
    avatarMedium: {
      height: 64,
      width: 64,
      fontSize: 35,
    },
    avatarLarge: {
      height: 100,
      width: 100,
      fontSize: 45,
    },
    avatarRegular: {
      height: 40,
      width: 40,
    },
    row: {
      color: '#fff',
    },
    accountName: {
      marginLeft: theme.spacing(1),
    },
    address: {
      marginTop: 10,
    },
    input: {
      display: 'none',
    },
    columnAvatar: {
      width: '100%',
    },
    uploader: {
      paddingTop: 15,
    },
    details: {
      marginLeft: theme.spacing(2),
    },
  }),
);

const ProfilePictureDir = 'profile_pictures';

const UserAvatar: React.FC<UserAvatarProps> = props => {
  const {
    type = 'row',
    onClick,
    showName = false,
    showTime = false,
    showEmail = false,
    nameSize = 'h5',
    avatarSize = 'regular',
    showAddress = false,
    uploader = false,
    avatarUrl = '',
    name = '',
    description = '',
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  const stateModel = useSelector<RootState, Model>(state => ({
    user: state.user,
  }));

  const { instance, id: userId, loaded, updatingAttributes } = stateModel.user;
  const { attributes } = instance || {};
  /* eslint-disable @typescript-eslint/camelcase */
  const { picture = '', given_name, family_name, email, address, zoneinfo } =
    attributes || {};

  const getAvatarSize = () => {
    if (avatarSize === 'medium') {
      return classes.avatarMedium;
    }
    if (avatarSize === 'large') {
      return classes.avatarLarge;
    }
    if (avatarSize === 'small') {
      return classes.avatarSmall;
    }

    return classes.avatarRegular;
  };

  const getAddress = () => {
    const addressParse = (address && JSON.parse(address)) || {};

    if (addressParse && addressParse.country && addressParse.state) {
      return `${addressParse.state}, ${addressParse.country}`;
    }

    return '';
  };

  const formatTimeZone = () => {
    const timeZoneSplit = new Date().toString().split(' ');
    return timeZoneSplit[5];
  };

  const onchange = async (e: any) => {
    const file = e.target.files[0];
    const res: UploadResponse = await S3Utils.uploadPortalFile(
      file,
      `${ProfilePictureDir}/${userId}/${file.name}`,
    );
    if (res && res.Location) {
      dispatch(
        updateUserAttributes({
          picture: res.Location,
        }),
      );
    }
  };

  const wrapSkeleton = (skeletonType: string, returnValue: any) => {
    const skeleton =
      skeletonType === 'avatar' ? (
        <Skeleton variant="circle" className={getAvatarSize()} />
      ) : (
        <Skeleton variant="text" />
      );
    if (!loaded || updatingAttributes) {
      return skeleton;
    }
    return returnValue;
  };

  const timeZineinfo = zoneinfo || formatTimeZone();

  const timeZone = showTime ? wrapSkeleton('text', timeZineinfo) : null;

  const userEmail = showEmail ? wrapSkeleton('text', email) : null;

  const userAddress = showAddress ? wrapSkeleton('text', getAddress()) : null;

  const getAvatarSrc = () => {
    if (picture && type !== 'row' && type !== 'image') {
      return picture;
    }

    return avatarUrl;
  };

  const getInitialValues = () => {
    if (given_name && family_name && type !== 'row' && type !== 'image') {
      return `${given_name} ${family_name}`;
    }

    return name;
  };

  const avatar = wrapSkeleton(
    'avatar',
    <Avatar alt="User" src={getAvatarSrc()} className={getAvatarSize()}>
      {/* eslint-disable @typescript-eslint/camelcase */}
      {getInitials(getInitialValues())}
    </Avatar>,
  );

  const userName = showName
    ? wrapSkeleton('text', `${given_name || ''} ${family_name || ''}`)
    : null;

  const upload = uploader ? (
    <Box className={classes.uploader}>
      <input
        accept="image/*"
        className={classes.input}
        id="icon-button-file"
        type="file"
        onChange={e => onchange(e)}
      />
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label htmlFor="icon-button-file">
        <Button
          color="primary"
          aria-label="upload picture"
          component="span"
          fullWidth
        >
          {picture ? 'Update profile picture' : 'Set Profile Picture'}
        </Button>
      </label>
    </Box>
  ) : null;

  const inlineButtonAvatar = (
    <Box
      id="avatar-btn"
      display="flex"
      alignItems="center"
      component={showName ? ButtonBase : IconButton}
      onClick={onClick}
      className={classes.row}
    >
      <Box className={classes.avatarContainer}>{avatar}</Box>
      {userName}
    </Box>
  );

  const inlineAvatar = (showDetail: boolean) => (
    <Box display="flex" alignItems="center">
      {avatar}
      {showDetail && (
        <Box className={classes.details}>
          <Typography variant="h5">{name}</Typography>
          <Typography variant="body1">{description}</Typography>
        </Box>
      )}
    </Box>
  );

  const columnAvatar = (
    <Box className={classes.columnAvatar}>
      <Box display="flex" justifyContent="center">
        {avatar}
      </Box>
      <Box mt={2} textAlign="center">
        <Hidden smDown>
          <Typography variant={nameSize} color="inherit">
            {userName}
          </Typography>
        </Hidden>
        <Typography variant="h6" color="textSecondary">
          {userEmail}
        </Typography>
        <Typography
          className={classes.address}
          color="textPrimary"
          variant="h6"
        >
          {userAddress}
        </Typography>
        <Typography color="textSecondary" variant="h6">
          {timeZone}
        </Typography>
      </Box>
      {upload}
    </Box>
  );

  const renderAvatar = () => {
    if (type === 'column') {
      return columnAvatar;
    }
    if (type === 'rowButton') {
      return inlineButtonAvatar;
    }
    if (type === 'image') {
      return inlineAvatar(false);
    }

    return inlineAvatar(true);
  };

  return <>{renderAvatar()}</>;
};

export default UserAvatar;
