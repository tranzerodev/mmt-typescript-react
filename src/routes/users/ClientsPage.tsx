import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Grid } from '@material-ui/core';
import {
  PageContent,
  FullCard,
  DenseCardContent,
  NewButton,
  TableTitle,
  PageTitle,
} from '../../components/UI';
import { listClients, listCompanyClients } from '../../store/clients/actions';
import * as ReduxType from '../../store/reduxTypes';
import NewClientModal from '../../components/Client/NewClientModal';
import * as UserUtils from '../../utils/UserUtils';
import { ClientFormData, ClientTableRowModal } from '../../store/clients/types';
import UsersTable from '../../components/UsersTable';

const mapStateToProps = (state: ReduxType.RootState) => ({
  user: state.user,
  clients: state.clients.clients,
  isClientsLoading: state.clients.isLoading,
  loadedClients: state.clients.loadedClients,
});

const mapDispatchToProps = (dispatch: ReduxType.AppThunkDispatch) => ({
  getClients: () => dispatch(listClients()),
  getCompanyClients: (companyId: string) =>
    dispatch(listCompanyClients(companyId)),
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

interface ClientModalModel {
  formValue: ClientFormData;
  open: boolean;
}

type PropsFromRedux = ConnectedProps<typeof connector>;

const ClientsPage: React.FC<PropsFromRedux> = props => {
  const {
    user,
    clients,
    isClientsLoading,
    loadedClients,
    getClients,
    getCompanyClients,
  } = props;

  const initialClient = {
    userId: '',
    companyName: '',
    cognitoEmail: '',
    cognitoFirstName: '',
    cognitoLastName: '',
    cognitoPassword: '',
    sendEmail: false,
  };

  const userTableParams = {
    visibleFields: {
      name: true,
      company: true,
      status: true,
      creationDate: true,
      actions: true,
    },
    sortableFields: [
      {
        field: 'name',
        sortable: true,
      },
      {
        field: 'company',
        sortable: true,
      },
      {
        field: 'status',
        sortable: true,
      },
      {
        field: 'creationDate',
        sortable: true,
        sort: 'desc',
      },
      {
        field: 'actions',
        sortable: true,
      },
    ],
  };

  const [modal, setModal] = React.useState<ClientModalModel>({
    formValue: initialClient,
    open: false,
  });

  const [isClient, setIsClient] = React.useState(false);
  const [companyId, setCompanyId] = React.useState('');

  React.useEffect(() => {
    setIsClient(UserUtils.IsClient(user));
    const userCompanyId = UserUtils.getCompanyId(user);
    setCompanyId(userCompanyId);

    if (!loadedClients && !isClientsLoading) {
      if (UserUtils.IsClient(user) && userCompanyId) {
        getCompanyClients(userCompanyId);
      } else {
        getClients();
      }
    }
  }, [user, loadedClients, isClientsLoading]);

  const resetModal = () => {
    setModal({
      formValue: initialClient,
      open: false,
    });
  };

  const openClientModal = (clientData?: ClientTableRowModal) => {
    if (clientData && clientData.userId) {
      const userCompanyId =
        clientData.clientFullData && clientData.clientFullData.fields.companyId;
      if (userCompanyId) {
        setCompanyId(userCompanyId);
      }

      const formData = {
        userId: clientData.userId,
        companyId: userCompanyId,
        companyName: clientData.company,
        cognitoEmail: clientData.name.email,
        cognitoFirstName: clientData.name.firstName,
        cognitoLastName: clientData.name.lastName,
        cognitoPassword: '',
        sendEmail: false,
      };
      setModal({
        formValue: formData,
        open: true,
      });
    } else {
      const userCompanyId = UserUtils.getCompanyId(user);
      setCompanyId(userCompanyId);
      setModal({
        ...modal,
        open: true,
      });
    }
  };

  const handleModalClose = () => {
    resetModal();
  };

  const handleAddClient = (status: boolean) => {
    if (status) {
      resetModal();
    }
  };

  const filterClients = () =>
    clients.filter(
      client =>
        client.owner &&
        client.owner.Attributes !== null &&
        client.fields &&
        client.fields.companyId,
    );

  return (
    <PageContent>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <PageTitle title="Users" />
        <NewButton onClick={openClientModal} htmlId="btn-new-user">
          New User
        </NewButton>
      </Grid>
      <FullCard variant="outlined">
        <DenseCardContent>
          <UsersTable
            users={filterClients()}
            loadedUsers={loadedClients}
            params={userTableParams}
            openModal={openClientModal}
          />
        </DenseCardContent>
        <NewClientModal
          formValue={modal.formValue}
          companyId={companyId}
          isClient={isClient}
          onAdd={handleAddClient}
          onCancel={handleModalClose}
          open={modal.open}
        />
      </FullCard>
    </PageContent>
  );
};

export default connector(ClientsPage);
