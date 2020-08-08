import React, { useContext, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, MenuItem, ListItemText, Menu } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { REGISTER_PAGE, LOGIN_PAGE } from '../../constants';
import history from '../../history';
import BaseNavabar from './BaseNavbar';
import * as UserUtils from '../../utils/UserUtils';
import { openAuthModal } from '../../store/ui/actions';
import { AUTH_STATES } from '../../constants/authConsts';
import { RouteContext } from '../../context';
import UserAvatar from '../User/UserAvatar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexGrow: {
      flexGrow: 1,
    },
    menu: {
      paddingBottom: 0,
    },
    authButton: {
      marginLeft: theme.spacing(1),
      color: theme.palette.primary.contrastText,
      padding: '4px',
    },
    registerButton: {
      marginLeft: theme.spacing(1),
      color: theme.palette.primary.contrastText,
      padding: '4px',
      border: '1px solid #ddd',
    },
    menuButton: {
      marginRight: theme.spacing(1),
    },
    icon: {
      marginRight: theme.spacing(0.5),
    },
  }),
);

type NavbarProps = {
  user: any;
  theme: string;
  signOut: () => void;
  onOpenSidebarMobile: () => void;
  onSignupModal: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  user,
  signOut,
  onOpenSidebarMobile,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [isClient, setIsClient] = React.useState(true);

  useEffect(() => {
    setIsClient(UserUtils.IsClient(user));
  }, [user]);

  const { isMobile } = useContext(RouteContext);
  const classes = useStyles();
  const dispatch = useDispatch();

  const onClickUserSetting = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeUserSetting = () => {
    setAnchorEl(null);
  };

  const navigate = (path: string) => {
    if (isMobile && (path === REGISTER_PAGE || path === LOGIN_PAGE)) {
      dispatch(openAuthModal(AUTH_STATES.DESKTOP_ONLY_MODAL));
      return;
    }
    closeUserSetting();
    /* eslint-disable @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    history.push(path);
  };

  return (
    <BaseNavabar menuClickCallback={onOpenSidebarMobile}>
      <div className={classes.flexGrow} />
      {user.isUnAuth ? (
        <>
          <Button
            id="navbar-signIn"
            onClick={() => navigate(LOGIN_PAGE)}
            className={classes.authButton}
          >
            Log In
          </Button>
          <Button
            id="navbar-signUp"
            onClick={() => navigate(REGISTER_PAGE)}
            className={classes.registerButton}
          >
            Sign Up
          </Button>
        </>
      ) : (
        <>
          <UserAvatar
            type="rowButton"
            avatarSize="small"
            onClick={onClickUserSetting}
          />
          <Menu
            id="customized-menu"
            anchorEl={anchorEl}
            classes={{ list: classes.menu }}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={closeUserSetting}
            elevation={1}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <MenuItem
              id="menu-item-settings"
              onClick={() => navigate('/settings')}
            >
              <ListItemText primary="Settings" />
            </MenuItem>
            <MenuItem id="menu-item-signout" onClick={signOut}>
              <ListItemText primary="Sign Out" />
            </MenuItem>
          </Menu>
        </>
      )}
    </BaseNavabar>
  );
};

export default Navbar;
