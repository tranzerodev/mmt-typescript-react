import React from 'react';
import { Dialog } from '@material-ui/core';
import EndpointForm, { EndpointFormProps } from './EndpointForm';

const CreateEndpointModal: React.FC<EndpointFormProps> = ({
  onCancel,
  handleSubmit,
  formValue,
  ...rest
}) => (
  <Dialog maxWidth="sm" fullWidth onClose={onCancel} {...rest}>
    <EndpointForm
      formValue={formValue}
      handleSubmit={handleSubmit}
      onCancel={onCancel}
    />
  </Dialog>
);

export default CreateEndpointModal;
