import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  makeStyles,
  createStyles,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@material-ui/core';
import * as ReduxType from '../../../store/reduxTypes';
import { listUsers } from '../../../store/users/actions';
import { User, User as CognitoUser } from '../../../store/users/types';
import { listCompanyClients } from '../../../store/clients/actions';
import { Client } from '../../../store/clients/types';
import { UserState } from '../../../store/user/types';
import UsersTable from '../../UsersTable';
import * as UserUtils from '../../../utils/UserUtils';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    cardContent: {
      height: '76vh',
      padding: 0,
      '&:last-child': {
        paddingBottom: 0,
      },
    },
  }),
);

interface MembersState {
  user: UserState;
  users: CognitoUser[];
  loadedUsers: boolean;
  clients: Client[];
  loadedClients: boolean;
}

export const Members: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [members, setMembers] = useState<User[]>([]);
  const [loadedMembers, setLoadedMembers] = useState(false);
  const userTableParams = {
    visibleFields: {
      name: true,
      creationDate: true,
    },
    sortableFields: [
      {
        field: 'name',
        sortable: true,
      },
      {
        field: 'creationDate',
        sortable: true,
        sort: 'desc',
      },
    ],
  };

  const usersState: MembersState = useSelector(
    (state: ReduxType.RootState) => ({
      user: state.user,
      users: state.users.users,
      loadedUsers: state.users.loadedUsers,
      clients: state.clients.clients,
      loadedClients: state.clients.loadedClients,
    }),
  );

  const { user, users, loadedUsers, clients, loadedClients } = usersState;

  useEffect(() => {
    const isClient = UserUtils.IsClient(user);
    const userCompanyId = UserUtils.getCompanyId(user);
    if (isClient && userCompanyId) {
      dispatch(listCompanyClients(userCompanyId));
      if (clients && clients.length > 0) {
        const clientsStaged = clients.map(
          (client: Client) => client.cognitoUser,
        );

        setMembers(clientsStaged);
        setLoadedMembers(loadedClients);
      }
    } else {
      dispatch(listUsers());
      if (users && users.length > 0 && clients && clients.length > 0) {
        const clientsMapped = clients.map(
          (client: Client) => client.cognitoUserId,
        );
        const usersStaged = users.filter(
          portalUser => !clientsMapped.includes(portalUser.Username),
        );
        setMembers(usersStaged);
        setLoadedMembers(loadedUsers);
      }
    }
  }, [user, loadedUsers, loadedClients]);

  return (
    <Card className={classes.root}>
      <CardContent className={classes.cardContent}>
        <UsersTable
          users={members}
          loadedUsers={loadedMembers}
          params={userTableParams}
        />
      </CardContent>
    </Card>
  );
};
