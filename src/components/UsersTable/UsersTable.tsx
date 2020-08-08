import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AgGrid, { LocaleDateFormatter, ClientActionRenderer } from '../AgGrid';
import UserAvatar from '../User/UserAvatar';
import {
  getFieldValue,
  userTableNameComparator,
  checkStatus,
} from '../../utils/UserUtils';
import useDeleteRecord from '../../utils/useDeleteRecord';
import { deleteClient, inviteClient } from '../../store/clients/actions';
import { ActionButtonModal } from '../Modals';
import DateUtils from '../../utils/DateUtils';
import {
  ClientTableRowModal,
  Company,
  Client,
} from '../../store/clients/types';
import * as ReduxType from '../../store/reduxTypes';
import portalConfig from '../../portalConfig';

interface SortParams {
  field?: string;
  sortable?: boolean;
  sort?: string;
}
interface UsersTableParams {
  visibleFields?: {
    name?: boolean;
    company?: boolean;
    role?: boolean;
    status?: boolean;
    creationDate?: boolean;
    location?: boolean;
    actions?: boolean;
  };
  sortableFields?: SortParams[];
}

interface UsersTableProps {
  users: Client[];
  loadedUsers: boolean;
  params: UsersTableParams;
  openModal: (data: ClientTableRowModal) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loadedUsers,
  params,
  openModal,
}) => {
  const { visibleFields = {}, sortableFields = [] } = params;

  const companies = useSelector<ReduxType.RootState, Company[]>(
    state => state.clients.companies,
  );

  const dispatch = useDispatch();

  const handleDelete = (userId: string) => {
    dispatch(deleteClient(userId));
  };

  const handleInviteConfirm = (userId: string) => {
    const currentClient = users.find(user => user.id === userId);
    if (currentClient) {
      dispatch(
        inviteClient(userId, getFieldValue(currentClient.owner, 'given_name')),
      );
    }
  };

  const {
    currentData,
    handleClickRemoveBtn,
    handleClose,
    handleConfirm,
  } = useDeleteRecord(handleDelete, 'userId');

  const {
    currentData: inviteUser,
    handleClickRemoveBtn: handleClickInviteBtn,
    handleClose: handleCloseInviteModal,
    handleConfirm: handleConfirmInviteModal,
  } = useDeleteRecord(handleInviteConfirm, 'userId');

  const [rowData, setRowData] = React.useState<ClientTableRowModal[]>([]);

  const getSortParams = (field: string): SortParams => {
    let sortObject = {};
    sortableFields.forEach(fieldItem => {
      if (fieldItem.field === field) {
        sortObject = {
          sort: fieldItem.sort,
          sortable: fieldItem.sortable,
        };
      }
    });

    return sortObject;
  };

  const openClientModal = (clientData: ClientTableRowModal) => {
    openModal(clientData);
  };

  const userColumnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      width: 150,
      cellRendererFramework(criteria: any) {
        return (
          <UserAvatar
            avatarUrl={criteria.value.avatarUrl}
            name={`${criteria.value.firstName} ${criteria.value.lastName}`}
            description={criteria.value.email}
          />
        );
      },
      comparator: userTableNameComparator,
      sortable: true,
      sort: 'asc',
      ...getSortParams('name'),
      hide: !visibleFields.name,
    },
    {
      headerName: 'Company',
      field: 'company',
      width: 150,
      ...getSortParams('company'),
      hide: !visibleFields.company,
    },
    {
      headerName: 'Role',
      field: 'role',
      width: 150,
      ...getSortParams('role'),
      hide: !visibleFields.role,
    },
    {
      headerName: 'Status',
      field: 'status',
      headerComponentParams: {
        tooltipDescription: [
          'A user can have the following states:',
          'Not Invited = The user has not received an email invite yet.',
          'Invited = The user has received an email invite but has not signed in and changed their password. Invites expire after 7 days.',
          'Pending Verification = The user has been created but has not yet passed email verification.',
          'Active = The user has fully set up their account.',
        ],
      },
      width: 150,
      ...getSortParams('status'),
      hide: !visibleFields.status,
    },
    {
      headerName: 'Creation date',
      field: 'creationDate',
      width: 150,
      valueFormatter: LocaleDateFormatter,
      comparator: DateUtils.dateComparator,
      ...getSortParams('creationDate'),
      hide: !visibleFields.creationDate,
    },
    {
      headerName: 'Location',
      field: 'location',
      width: 150,
      ...getSortParams('location'),
      hide: !visibleFields.location,
    },
    {
      headerName: 'Actions',
      width: 150,
      suppressSizeToFit: true,
      pinned: 'right',
      cellRendererFramework(criteria: any) {
        return (
          <ClientActionRenderer
            handleClickRemove={() => handleClickRemoveBtn(criteria.data)}
            handleClickEdit={() => openClientModal(criteria.data)}
            handleClickInvite={() => handleClickInviteBtn(criteria.data)}
            data={criteria.data}
          />
        );
      },
      hide: !visibleFields.actions,
    },
  ];

  React.useEffect(() => {
    const formattedUsers = users.map((client: Client) => {
      const userData = client.owner;
      const profile = {
        firstName: getFieldValue(userData, 'given_name'),
        lastName: getFieldValue(userData, 'family_name'),
        avatarUrl: getFieldValue(userData, 'picture'),
        email: getFieldValue(userData, 'email'),
      };
      const companyData = companies.find(
        company => company.id === client.fields.companyId,
      );
      return {
        name: profile,
        company: companyData ? companyData.fields.name : '',
        role: getFieldValue(userData, 'custom:role'),
        creationDate: client.createdDate,
        location: getFieldValue(userData, 'address'),
        userId: client.id,
        userName: `${profile.firstName} ${profile.lastName}`,
        status: checkStatus(client),
        clientFullData: client,
      };
    });
    setRowData(loadedUsers ? formattedUsers : []);
  }, [users, companies, loadedUsers]);

  return (
    <>
      {currentData && currentData.id && (
        <ActionButtonModal
          open={!!currentData.id}
          onClose={handleClose}
          positiveAction
          onPositiveActionPerformed={handleConfirm}
          label="Delete User"
          title="Delete User"
          positiveActionText="Confirm"
          mainComponent={`Are you sure you want to delete ${
            currentData.data.userName
          }?`}
        />
      )}

      {inviteUser && inviteUser.id && (
        <ActionButtonModal
          open={!!inviteUser.id}
          onClose={handleCloseInviteModal}
          positiveAction
          onPositiveActionPerformed={handleConfirmInviteModal}
          label="Invite User"
          title="Invite User"
          cancelActionText="Cancel"
          positiveActionText="Invite User"
          mainComponent={`When you invite a user, they will receive an email with account credentials to log into the ${
            portalConfig.Company
          }?`}
        />
      )}

      <AgGrid
        rowData={rowData}
        columnDefs={userColumnDefs}
        rowHeight={60}
        rowSelection="multiple"
        overlayLoadingTemplate="Loading Users"
        overlayNoRowsTemplate="No users have been created"
        pagination
        paginationAutoPageSize
      />
    </>
  );
};

export default UsersTable;
