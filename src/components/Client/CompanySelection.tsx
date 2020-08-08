import React, { useState, useCallback } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { FormikTouched, FormikErrors } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { ClientFormData, Company } from '../../store/clients/types';
import * as ReduxType from '../../store/reduxTypes';
import { listClients } from '../../store/clients/actions';

interface CompanyData {
  companyId: string;
  companyName: string;
}

interface CompanySelectionProps {
  values?: ClientFormData;
  touched?: FormikTouched<ClientFormData>;
  errors?: FormikErrors<ClientFormData>;
  setFieldValue?: (field: string, value: string) => void;
  onCompanyChange?: (clientCompany: CompanyData) => void;
  handleBlur?: (e: React.FocusEvent<any>) => void;
  handleChange?: (e: React.ChangeEvent<any>) => void;
  handleCompanyIdChange?: (companyId: string) => void;
  onUpdate?: (data: { [fieldName: string]: string }) => void;
  fieldName?: string;
  labelValue?: string;
  variantValue?: string;
  selectedClient?: string;
  defaultOptions?: CompanyData[];
}

const CompanySelection: React.FC<CompanySelectionProps> = props => {
  const {
    values,
    touched,
    errors,
    setFieldValue,
    onCompanyChange,
    handleBlur,
    handleChange,
    handleCompanyIdChange,
    onUpdate,
    fieldName,
    labelValue,
    variantValue,
    selectedClient,
    defaultOptions,
    ...otherProps
  } = props;

  const dispatch = useDispatch();

  const companies = useSelector<ReduxType.RootState, Company[]>(
    state => state.clients.companies,
  );
  const isClientsLoading = useSelector<ReduxType.RootState, boolean>(
    state => state.clients.isLoading,
  );
  const loadedClients = useSelector<ReduxType.RootState, boolean>(
    state => state.clients.loadedClients,
  );

  const [clientOptions, setClientOptions] = useState<CompanyData[]>(
    defaultOptions || [],
  );

  const [currentClient, setCurrentClient] = useState<CompanyData>({
    companyName: '',
    companyId: '',
  });

  React.useEffect(() => {
    setClientOptions(
      (defaultOptions || []).concat(
        companies.map(company => ({
          companyId: company.id,
          companyName: company.fields.name,
        })),
      ),
    );
  }, [companies]);

  React.useEffect(() => {
    if (!loadedClients && !isClientsLoading) {
      dispatch(listClients());
    }
  }, []);

  React.useEffect(() => {
    if (selectedClient) {
      const currentClientData = clientOptions.find(
        client => client.companyId === selectedClient,
      );
      if (currentClientData) {
        setCurrentClient(currentClientData);
      }
    } else if (values && !values.cognitoEmail) {
      setCurrentClient({
        companyName: '',
        companyId: '',
      });
    }
  }, [values, selectedClient, clientOptions]);

  const handleCompanyChange = (
    event: React.ChangeEvent<any>,
    selectedCompany?: any,
  ) => {
    const inputValue = event.target.value as string;

    if (selectedCompany) {
      if (onUpdate && fieldName) {
        onUpdate({ [fieldName]: selectedCompany.companyId });
      }
      if (setFieldValue) {
        setFieldValue(
          'companyName',
          selectedCompany.companyName ? selectedCompany.companyName : '',
        );
      }
      if (handleChange) {
        handleChange(event);
      }
      if (handleCompanyIdChange) {
        handleCompanyIdChange(selectedCompany.companyId);
      }
    } else if (inputValue) {
      if (onUpdate && fieldName) {
        onUpdate({ [fieldName]: `NEW__${inputValue}` });
      }
      if (handleChange) {
        handleChange(event);
      }
      if (handleCompanyIdChange) {
        handleCompanyIdChange('');
      }
    } else {
      if (onUpdate && fieldName) {
        onUpdate({ [fieldName]: '' });
      }
      if (handleCompanyIdChange) {
        handleCompanyIdChange('');
      }
      if (handleChange) {
        handleChange(event);
      }
    }
  };

  return (
    <Autocomplete
      freeSolo
      defaultValue={{
        companyName: values ? values.companyName : '',
        companyId: values ? values.companyId : '',
      }}
      value={currentClient}
      onChange={(event, value) => handleCompanyChange(event, value)}
      options={clientOptions}
      getOptionLabel={option => option.companyName}
      renderInput={params => (
        <TextField
          {...params}
          error={
            touched && errors
              ? Boolean(touched.companyName && errors.companyName)
              : false
          }
          helperText={
            touched && errors ? touched.companyName && errors.companyName : ''
          }
          label={labelValue || 'Input Company name or select existing one'}
          id="company-name-input"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password',
          }}
          value={values ? values.companyName : ''}
          name={values ? 'companyName' : undefined}
          onChange={event => handleCompanyChange(event)}
          fullWidth
          onBlur={handleBlur}
          autoComplete="off"
          variant={variantValue ? (variantValue as any) : ('standard' as any)}
          {...otherProps}
        />
      )}
    />
  );
};

export default CompanySelection;
