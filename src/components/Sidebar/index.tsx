import React, { useEffect, useContext, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import {
  Collapse,
  Box,
  IconButton,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  LocalOfferOutlined as LocalOfferIcon,
  GroupOutlined as GroupIcon,
} from '@material-ui/icons';
import {
  Home as HomeIcon,
  Icon,
  Sidebar as SidebarIcon,
  Layout as LayoutIcon,
  Sliders as CustomizationIcon,
  BookOpen as BookOpenIcon,
} from 'react-feather';
import portalConfig from '../../portalConfig';
import { RouteContext } from '../../context';
import {
  EXPERIENCES_PAGE,
  DASHBOARD_PAGE,
  HOME_PAGE_PATH,
  PACKAGES_PAGE,
  PRODUCTS_PAGE,
  ENDPOINTS_PAGE,
  MOVING_ENDPOINTS_PAGE,
  COMPANIES_PAGE,
  USERS_PAGE,
  RESOURCES_PAGE,
} from '../../constants';
import { openAuthModal } from '../../store/ui/actions';
import { AUTH_STATES } from '../../constants/authConsts';
import history from '../../history';
import * as ReduxType from '../../store/reduxTypes';
import { UserState } from '../../store/user/types';
import * as UserUtils from '../../utils/UserUtils';
import UserAvatar from '../User/UserAvatar';
import { SettingsIcon, ViewIcon } from '../Icons';

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mobileDrawerContainer: {
      [theme.breakpoints.up('lg')]: {
        display: 'none',
      },
    },
    desktopDrawerContainer: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    mobileDrawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    desktopDrawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    toolbar: theme.mixins.toolbar,
    listItemIcon: {
      color: '#000',
      minWidth: '35px',
      height: 'auto',
    },
    nested: {
      margin: 0,
      paddingLeft: theme.spacing(2),
    },
    defaultListItem: {
      width: 'auto',
      height: '38px',
      margin: theme.spacing(0.5),
      borderRadius: '5px',
    },
    list: {
      paddingTop: 15,
    },
    collapse: {
      '& .MuiCollapse-wrapper': {
        marginTop: theme.spacing(-1),
        marginBottom: theme.spacing(-1),
      },
    },
    listItem: {
      '&:hover': {
        backgroundColor: fade(theme.palette.primary.main, 0.05),
      },
      '&:hover span': {
        color: theme.palette.primary.main,
      },
      '&:hover svg': {
        color: theme.palette.primary.main,
      },
    },
    selected: {
      backgroundColor: `${fade(theme.palette.primary.main, 0.1)} !important`,
      '& span': {
        fontWeight: 600,
        color: theme.palette.primary.main,
      },
      '& svg': {
        color: theme.palette.primary.main,
        fill: `${fade(theme.palette.primary.contrastText, 0.9)}`,
        '& > circle': {
          position: 'fixed',
          color: 'black',
          zIndex: '2 !important',
        },
      },
    },
    sectionTitle: {
      marginTop: '40px',
      color: theme.palette.primary.dark,
    },
    viewBtn: {
      borderRadius: '5px',
      marginRight: theme.spacing(-1.5),
    },
  }),
);

type DrawerProps = {
  children: React.ReactNode;
};

const mapStateToProps = (state: ReduxType.RootState) => ({
  movingEndpoints: state.endpoints.movingEndpoints,
  resources: state.data.resources,
});

const mapDispatchToProps = (dispatch: ReduxType.AppThunkDispatch) => ({
  openDesktopOnlyModal: () =>
    dispatch(openAuthModal(AUTH_STATES.DESKTOP_ONLY_MODAL)),
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface SidebarProps {
  user: UserState;
  openMobile: boolean;
  onMobileClose: () => void;
  openDesktopOnlyModal: () => void;
}

const Sidebar: React.FC<PropsFromRedux & SidebarProps> = ({
  movingEndpoints,
  user,
  openMobile,
  onMobileClose,
  openDesktopOnlyModal,
  resources,
}) => {
  const classes = useStyles();
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isClientsOpen, setIsClientsOpen] = useState(false);

  const { pathname, isMobile } = useContext(RouteContext);
  const navigate = (path: string) => {
    if (isMobile && (path === DASHBOARD_PAGE || path === RESOURCES_PAGE)) {
      openDesktopOnlyModal();
    } else {
      /* eslint-disable @typescript-eslint/ban-ts-ignore */
      // @ts-ignore
      history.push(path);
    }
  };

  const toggleInventory = () => {
    setIsInventoryOpen(!isInventoryOpen);
    setIsClientsOpen(false);
    navigate(PRODUCTS_PAGE);
  };

  const toggleClients = () => {
    setIsClientsOpen(!isClientsOpen);
    setIsInventoryOpen(false);
    navigate(COMPANIES_PAGE);
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname === PRODUCTS_PAGE || pathname === ENDPOINTS_PAGE) {
      setIsInventoryOpen(true);
    }

    if (pathname === COMPANIES_PAGE || pathname === USERS_PAGE) {
      setIsClientsOpen(true);
    }
  }, [pathname]);

  const listItemStyle = (path: string) =>
    `${classes.listItem} ${pathname === path ? classes.selected : ''}`;

  const renderListItemNav = (
    label: string,
    htmlId: string,
    path: string,
    IconElement?: Icon,
  ) => (
    <ListItem
      onClick={() => {
        navigate(path);
        setIsClientsOpen(false);
        setIsInventoryOpen(false);
      }}
      id={htmlId}
      selected={pathname === path}
      classes={{
        button: classes.defaultListItem,
      }}
      className={listItemStyle(path)}
      button
    >
      {IconElement && (
        <ListItemIcon classes={{ root: classes.listItemIcon }}>
          <IconElement />
        </ListItemIcon>
      )}
      <ListItemText primary={label} />
    </ListItem>
  );

  const renderSettings = () =>
    user.isUnAuth ? null : (
      <Box p={2}>
        <UserAvatar type="column" avatarSize="medium" showName showEmail />
      </Box>
    );

  const DrawerSection: React.FC<DrawerProps> = ({ children }) => (
    <>
      <div className={classes.mobileDrawerContainer}>
        <Drawer
          variant="temporary"
          classes={{
            paper: classes.mobileDrawer,
          }}
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
        >
          {children}
        </Drawer>
      </div>
      <div className={classes.desktopDrawerContainer}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.desktopDrawer,
          }}
          anchor="left"
          open
        >
          {children}
        </Drawer>
      </div>
    </>
  );

  const renderClientSideBar = () => {
    const content = (
      <>
        <div className={classes.toolbar} />
        {renderSettings()}
        <Divider />
        <List className={classes.list}>
          {renderListItemNav(
            'Packages',
            'sidebar-packages-client',
            EXPERIENCES_PAGE,
            HomeIcon,
          )}
          {renderListItemNav(
            'Dashboard',
            'sidebar-dashboard-client',
            DASHBOARD_PAGE,
            SidebarIcon,
          )}
          {!portalConfig.features.resourceSectionDisabled &&
            resources.length > 0 &&
            renderListItemNav(
              'Resources',
              'sidebar-resources',
              RESOURCES_PAGE,
              BookOpenIcon,
            )}
        </List>
      </>
    );
    return <DrawerSection>{content}</DrawerSection>;
  };

  const content = (
    <>
      <div className={classes.toolbar} />
      {renderSettings()}
      <Divider />
      <List className={classes.list}>
        {renderListItemNav(
          'Dashboard',
          'sidebar-dashboard',
          HOME_PAGE_PATH,
          HomeIcon,
        )}
        {renderListItemNav(
          'Proposals',
          'sidebar-proposals',
          PACKAGES_PAGE,
          LayoutIcon,
        )}
        <ListItem
          classes={{
            button: classes.defaultListItem,
          }}
          className={classes.listItem}
          button
          onClick={toggleInventory}
        >
          <ListItemIcon classes={{ root: classes.listItemIcon }}>
            <LocalOfferIcon />
          </ListItemIcon>
          <ListItemText primary="Inventory" />
        </ListItem>
        <Collapse
          className={classes.collapse}
          in={isInventoryOpen}
          timeout="auto"
          unmountOnExit
        >
          <div className={classes.nested}>
            {renderListItemNav('Products', 'sidebar-products', PRODUCTS_PAGE)}
            {renderListItemNav(
              'Endpoints',
              'sidebar-endpoints',
              ENDPOINTS_PAGE,
            )}
            {movingEndpoints &&
              movingEndpoints.length > 0 &&
              renderListItemNav(
                'Moving Endpoints',
                'moving-endpoints',
                MOVING_ENDPOINTS_PAGE,
              )}
          </div>
        </Collapse>
        {portalConfig.businessMode === 'b2b' && (
          <>
            <ListItem
              classes={{
                button: classes.defaultListItem,
              }}
              className={classes.listItem}
              button
              onClick={toggleClients}
              id="sidebar-clients"
            >
              <ListItemIcon classes={{ root: classes.listItemIcon }}>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Clients" />
            </ListItem>
            <Collapse
              in={isClientsOpen}
              timeout="auto"
              unmountOnExit
              className={classes.collapse}
            >
              <div className={classes.nested}>
                {renderListItemNav(
                  'Companies',
                  'sidebar-companies',
                  COMPANIES_PAGE,
                )}
                {renderListItemNav('Users', 'sidebar-users', USERS_PAGE)}
              </div>
            </Collapse>
          </>
        )}

        {portalConfig.businessMode === 'b2c' &&
          renderListItemNav(
            'Clients',
            'sidebar-clients',
            USERS_PAGE,
            GroupIcon,
          )}

        {!portalConfig.features.myPortalSectionDisabled && (
          <>
            <ListItem
              className={`${classes.sectionTitle} ${classes.defaultListItem}`}
            >
              <ListItemText primary="My Portal" />
              <a href="/feed" target="_blank">
                <IconButton
                  aria-label="view"
                  color="inherit"
                  classes={{ root: classes.listItemIcon }}
                  className={classes.viewBtn}
                >
                  {ViewIcon}
                </IconButton>
              </a>
            </ListItem>
            <Divider />
            {renderListItemNav(
              'Customization',
              'sidebar-customization',
              '/portal/customization',
              CustomizationIcon,
            )}
            {resources.length > 0 &&
              renderListItemNav(
                'Resources',
                'sidebar-resources',
                RESOURCES_PAGE,
                BookOpenIcon,
              )}
            {renderListItemNav(
              'Preferences',
              'sidebar-preferences',
              '/portal/preferences',
              SettingsIcon,
            )}
          </>
        )}
      </List>
    </>
  );

  return UserUtils.IsClient(user) ? (
    renderClientSideBar()
  ) : (
    <DrawerSection>{content}</DrawerSection>
  );
};

export default connector(Sidebar);
