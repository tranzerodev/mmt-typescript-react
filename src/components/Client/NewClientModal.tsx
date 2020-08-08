import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@material-ui/core';
import AddClientForm from './AddClientForm';
import {
  ClientFormData,
  ClientsStoreChangeModel,
} from '../../store/clients/types';
import * as ReduxType from '../../store/reduxTypes';
import { addClient, updateClientUser } from '../../store/clients/actions';

interface ClientModalProps {
  companyId: string;
  isClient: boolean;
  formValue: ClientFormData;
  open: boolean;
  onAdd: (status: boolean) => void;
  onCancel: () => void;
}

const NewClientModal: React.FC<ClientModalProps> = props => {
  const {
    isClient,
    companyId,
    formValue,
    onCancel,
    onAdd,
    open,
    ...rest
  } = props;

  const dispatch = useDispatch();

  const clientStoreChangeState = useSelector<
    ReduxType.RootState,
    ClientsStoreChangeModel
  >(state => ({
    isCreating: state.clients.isCreating,
    isUpdating: state.clients.isUpdating,
    createdClient: state.clients.createdClient,
    updatedClient: state.clients.updatedClient,
    error: state.clients.error,
    clients: state.clients.clients,
    companies: state.clients.companies,
  }));

  const handleSubmitClient = (data: ClientFormData) => {
    if (data.userId) {
      dispatch(updateClientUser(data));
    } else {
      dispatch(addClient(data));
    }
  };

  React.useEffect(() => {
    const {
      isCreating,
      createdClient,
      isUpdating,
      updatedClient,
      error,
    } = clientStoreChangeState;

    if (
      (!isCreating && !createdClient && !!error) ||
      (!isUpdating && !updatedClient && !!error)
    ) {
      onAdd(false);
    } else if ((createdClient && !error) || (updatedClient && !error)) {
      onAdd(true);
    }
  }, [
    clientStoreChangeState.isCreating,
    clientStoreChangeState.createdClient,
    clientStoreChangeState.isUpdating,
    clientStoreChangeState.updatedClient,
    clientStoreChangeState.error,
  ]);

  return (
    <Dialog maxWidth="sm" fullWidth onClose={onCancel} open={open} {...rest}>
      {open && (
        <AddClientForm
          isClient={isClient}
          companyId={companyId}
          companies={clientStoreChangeState.companies}
          formValue={formValue}
          onAdd={handleSubmitClient}
          onCancel={onCancel}
        />
      )}
    </Dialog>
  );
};

export default NewClientModal;
