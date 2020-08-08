import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer, Box } from '@material-ui/core';
import SearchInput from '../SearchInput/SearchInput';
import { UserAvatar } from '../User';
import { RootState } from '../../store/reduxTypes';
import { selectClient } from '../../store/files/actions';
import * as UserUtils from '../../utils/UserUtils';
import { listCompanyClients, listClients } from '../../store/clients/actions';
import portalConfig from '../../portalConfig';
import { BUSINESS_MODE } from '../../constants';
import { getFieldValue } from '../../utils/UserUtils';
import { SelectedClient } from '../../store/files/types';
import { Company, Client } from '../../store/clients/types';

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerDesktopRoot: {
      width: drawerWidth,
      flexShrink: 0,
      height: '100%',
    },
    drawerDesktopPaper: {
      position: 'relative',
    },
    contentItem: {
      padding: theme.spacing(2),
      borderBottom: '1px solid #ECEFF1',
      '&:hover': {
        backgroundColor: '#fafafa',
        cursor: 'pointer',
        boxShadow: `inset 3px 0px 0px ${theme.palette.primary.main}`,
      },
    },
    selected: {
      backgroundColor: '#fafafa',
      cursor: 'pointer',
      boxShadow: `inset 3px 0px 0px ${theme.palette.primary.main}`,
    },
  }),
);

interface ClientExtended extends Client {
  fullName: string;
  picture: string;
}

interface CompanyExtended extends Company {
  companyName: string;
}

export const FilesSidebar: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [companiesFiltered, setCompaniesFiltered] = useState<CompanyExtended[]>(
    [],
  );
  const [clientsFiltered, setClientsFiltered] = useState<ClientExtended[]>([]);
  const [companiesMapped, setCompaniesMapped] = useState<CompanyExtended[]>([]);
  const [clientsMapped, setClientsMapped] = useState<ClientExtended[]>([]);
  const { user } = useSelector((state: RootState) => state);
  const { selectedClient } = useSelector((state: RootState) => state.files);
  const {
    clients,
    companies,
    loadedClients,
    isLoading: isClientsLoading,
  } = useSelector((state: RootState) => state.clients);

  const filterBySerchKey = (array: any, serchKey: string) =>
    array.filter((o: any) =>
      Object.keys(o).some((k: string) => {
        if (typeof o[k] === 'string') {
          return o[k].toLowerCase().includes(serchKey.toLowerCase());
        }

        return '';
      }),
    );

  const searchKeyChange = (serchKey: string) => {
    if (portalConfig.businessMode === BUSINESS_MODE.B2B) {
      const companiesStaged = filterBySerchKey(companiesMapped, serchKey);
      setCompaniesFiltered(companiesStaged);
    }

    if (portalConfig.businessMode === BUSINESS_MODE.B2C) {
      const clientsStaged = filterBySerchKey(clientsMapped, serchKey);
      setClientsFiltered(clientsStaged);
    }
  };

  const contentItem = (
    name: string,
    imageUrl: string,
    client: SelectedClient,
    props?: any,
  ) => (
    <Box
      key={client.clientId}
      className={`${classes.contentItem} ${
        selectedClient && selectedClient.clientId === client.clientId
          ? classes.selected
          : ''
      }`}
      onClick={() => dispatch(selectClient(client))}
    >
      <UserAvatar name={name} avatarUrl={imageUrl} {...props} />
    </Box>
  );

  useEffect(() => {
    const userCompanyId = UserUtils.getCompanyId(user);

    if (!loadedClients && !isClientsLoading) {
      if (UserUtils.IsClient(user) && userCompanyId) {
        listCompanyClients(userCompanyId);
      } else {
        dispatch(listClients());
      }

      let client: SelectedClient = {
        clientId: '',
        clientType: 'owner',
      };
      if (UserUtils.IsClient(user)) {
        client = {
          ...client,
          clientId:
            user.instance &&
            user.instance.attributes &&
            user.instance.attributes['custom:companyName']
              ? user.instance.attributes['custom:companyName']
              : '',
        };
      } else {
        client = {
          ...client,
          clientId: user.id,
        };
      }
      dispatch(selectClient(client));
    }
  }, [user, loadedClients, isClientsLoading]);

  useEffect(() => {
    if (companies && companies.length > 0) {
      const companiesStagedMap = companies.map(company => ({
        ...company,
        companyName: (company.fields && company.fields.name) || '',
      }));
      setCompaniesFiltered(companiesStagedMap);
      setCompaniesMapped(companiesStagedMap);
    }

    if (clients && clients.length > 0) {
      const clientsStaged = clients.filter(
        client => client.fields && client.fields.companyId !== null,
      );
      const clientsStagedMap = clientsStaged.map(client => ({
        ...client,
        fullName:
          `${getFieldValue(client.owner, 'given_name')} ${getFieldValue(
            client.owner,
            'family_name',
          )}` || '',
        picture: getFieldValue(client.owner, 'picture'),
      }));
      setClientsFiltered(clientsStagedMap);
      setClientsMapped(clientsStagedMap);
    }
  }, [clients, companies]);

  return (
    <>
      <Box>
        <Drawer
          variant="permanent"
          classes={{
            root: classes.drawerDesktopRoot,
            paper: classes.drawerDesktopPaper,
          }}
        >
          <Box>
            <SearchInput
              placeholderPrefix="Select"
              searchLabel="Client"
              width="auto"
              handleChange={searchKeyChange}
            />
            {contentItem(
              'My Files',
              '',
              { clientId: user.id, clientType: 'owner' },
              { type: '' },
            )}
            {// Companies
            portalConfig.businessMode === BUSINESS_MODE.B2B &&
              companiesFiltered.map(company =>
                contentItem(
                  `${company.companyName}'s Files` || '',
                  '',
                  { clientId: company.id, clientType: '' },
                  { type: 'row' },
                ),
              )}
            {// Clients
            portalConfig.businessMode === BUSINESS_MODE.B2C &&
              clientsFiltered.map(client =>
                contentItem(
                  `${client.fullName}'s Files` || '',
                  client.picture || '',
                  { clientId: client.id, clientType: '' },
                  { type: '' },
                ),
              )}
          </Box>
        </Drawer>
      </Box>
    </>
  );
};
