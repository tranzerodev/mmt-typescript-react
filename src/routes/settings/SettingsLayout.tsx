import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Tabs, Divider } from '@material-ui/core';
import { PageContent } from '../../components/UI';
import {
  Profile,
  Security,
  Members,
  Subscriptions,
  Banking,
} from '../../components/Settings';
import { RouteContext, ContextProps } from '../../context';
import { LoadSettings } from '../../store/settings/actions';
import { SETTINGS_PAGE, BUSINESS_MODE } from '../../constants';
import history from '../../history';
import * as ReduxType from '../../store/reduxTypes';
import * as UserUtils from '../../utils/UserUtils';
import portalConfig from '../../portalConfig';

interface TabModel {
  value: string;
  label: string;
}

export const SettingsLayout: React.FC = () => {
  const { user } = useSelector((state: ReduxType.RootState) => state);
  const dispatch = useDispatch();
  const context: ContextProps = useContext(RouteContext);
  const { query } = context;
  const { tab = 'profile' } = query;

  const settings = SETTINGS_PAGE;
  const profileTab = `${settings}?tab=profile`;
  const securityTab = `${settings}?tab=security`;
  const membersTab = `${settings}?tab=members`;
  const subscriptionsTab = `${settings}?tab=subscriptions`;
  const bankingTab = `${settings}?tab=banking`;

  const [currentTab, setCurrentTab] = useState<string>(
    `${settings}?tab=profile`,
  );
  const [isClient, setIsClient] = useState<boolean>(false);

  const tabLabels = {
    profile: 'Profile',
    security: 'Security',
    members: 'Team',
    subscription: 'Subscription',
    banking: 'Banking',
  };

  useEffect(() => {
    dispatch(LoadSettings());
  }, []);

  useEffect(() => {
    setCurrentTab(`${settings}?tab=${tab}`);
  }, [tab]);

  useEffect(() => {
    setIsClient(UserUtils.IsClient(user));
  }, [user]);

  const handleTabsChange = (_: React.ChangeEvent<{}>, value: string) => {
    /* eslint-disable @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    history.push(value);
  };

  const tabs: TabModel[] = [
    { value: profileTab, label: tabLabels.profile },
    { value: securityTab, label: tabLabels.security },
    { value: membersTab, label: tabLabels.members },
    { value: subscriptionsTab, label: tabLabels.subscription },
    { value: bankingTab, label: tabLabels.banking },
  ];

  const filteredTabs = () =>
    tabs.filter(tabObject => {
      if ([subscriptionsTab, bankingTab].includes(tabObject.value)) {
        return !isClient;
      }

      if (tabObject.value === membersTab) {
        return portalConfig.businessMode !== BUSINESS_MODE.B2C;
      }

      return true;
    });

  return (
    <PageContent>
      <Box>
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {filteredTabs().map(tabItem => (
            <Tab
              key={tabItem.value}
              label={tabItem.label}
              value={tabItem.value}
            />
          ))}
        </Tabs>
      </Box>
      <Divider />
      <Box mt={3} height={1}>
        {currentTab === profileTab && <Profile />}
        {currentTab === securityTab && <Security />}
        {currentTab === membersTab && <Members />}
        {currentTab === subscriptionsTab && <Subscriptions />}
        {currentTab === bankingTab && <Banking />}
      </Box>
    </PageContent>
  );
};
