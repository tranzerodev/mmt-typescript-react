import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog } from '@material-ui/core';
import AddCompanyForm from './AddCompanyForm';
import {
  CompanyFormData,
  ClientFormData,
  ClientsStoreChangeModel,
} from '../../store/clients/types';
import * as ReduxType from '../../store/reduxTypes';
import {
  addClient,
  updateCompany,
  addCompany,
} from '../../store/clients/actions';

interface CompanyModalProps {
  formValue: CompanyFormData;
  open: boolean;
  onAdd: (status: boolean) => void;
  onCancel: () => void;
}

const NewCompanyModal: React.FC<CompanyModalProps> = props => {
  const { formValue, onCancel, onAdd, open, ...rest } = props;

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

  const handleSubmitCompany = (data: CompanyFormData) => {
    if (data.companyId) {
      dispatch(updateCompany(data as ClientFormData));
    } else {
      dispatch(addCompany(data as ClientFormData));
    }
  };

  const [formData, setFormData] = useState(formValue);

  React.useEffect(() => {
    setFormData(formValue);
  }, [formValue]);

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
        <AddCompanyForm
          clients={clientStoreChangeState.clients}
          formValue={formData}
          onAdd={handleSubmitCompany}
          onCancel={onCancel}
        />
      )}
    </Dialog>
  );
};

export default NewCompanyModal;
