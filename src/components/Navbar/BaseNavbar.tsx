import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from '../Logo';
import history from '../../history';
import { HOME_PAGE_PATH } from '../../constants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      boxShadow: 'none',
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(1),
    },
    logo: {
      cursor: 'pointer',
      fontSize: '35px',
      color: theme.palette.primary.contrastText,
    },
    menuButtonContainer: {
      [theme.breakpoints.up('lg')]: {
        display: 'none',
      },
    },
  }),
);

const routeHome = () => {
  // TODO: we need to fix this place
  // history could be undefined
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  history.push(HOME_PAGE_PATH);
};

interface BaseNavabarProps {
  children?: React.ReactNode;
  menuClickCallback?: () => void;
  menuToggleButton?: boolean;
}

const BaseNavabar: React.FC<BaseNavabarProps> = ({
  children,
  menuClickCallback,
  menuToggleButton = true,
}) => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        {menuToggleButton ? (
          <div className={classes.menuButtonContainer}>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              onClick={menuClickCallback}
              id="menu-hamburger"
            >
              <MenuIcon />
            </IconButton>
          </div>
        ) : null}
        <Logo className={classes.logo} onClick={() => routeHome()} />
        {children}
      </Toolbar>
    </AppBar>
  );
};

export default BaseNavabar;
