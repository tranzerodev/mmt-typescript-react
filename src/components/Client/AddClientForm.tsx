import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Button,
  makeStyles,
} from '@material-ui/core';

import { ClientFormData, Client, Company } from '../../store/clients/types';
import CompanySelection from './CompanySelection';
import * as UserUtil from '../../utils/UserUtils';
import FREE_EMAIL_DOMAIN_LIST from '../../constants/freeEmailList';

interface EmailDomainModel {
  companyId: string;
  emailDomains: string[];
}

type ChangeHandler = (event: React.ChangeEvent) => void;

type SetFieldHandler = (
  field: string,
  value: any,
  shouldValidate?: boolean | undefined,
) => void;

const useStyles = makeStyles(theme => ({
  root: {},
  confirmButton: {
    marginLeft: theme.spacing(2),
  },
}));

const schema = Yup.object().shape(
  {
    companyName: Yup.string()
      .max(255)
      .required('Company name is required.'),
    cognitoEmail: Yup.string()
      .email('Please enter a valid email.')
      .when(['cognitoFirstName', 'cognitoLastName'], {
        is: (cognitoFirstName, cognitoLastName) =>
          !!cognitoFirstName || !!cognitoLastName,
        then: Yup.string()
          .email('Please enter a valid email.')
          .required('Email is required when first name or last name is set.'),
      }),
    cognitoFirstName: Yup.string().when(['cognitoEmail', 'cognitoLastName'], {
      is: (cognitoEmail, cognitoLastName) =>
        !!cognitoEmail || !!cognitoLastName,
      then: Yup.string().required(
        'First name is required when Email or last name is set.',
      ),
    }),
    cognitoLastName: Yup.string().when(['cognitoFirstName', 'cognitoEmail'], {
      is: (cognitoFirstName, cognitoEmail) =>
        !!cognitoFirstName || !!cognitoEmail,
      then: Yup.string().required(
        'Last name is required when Email or first name is set.',
      ),
    }),
  },
  [
    ['cognitoEmail', 'cognitoFirstName'],
    ['cognitoEmail', 'cognitoLastName'],
    ['cognitoFirstName', 'cognitoLastName'],
  ],
);

type AddClientFormProps = {
  isClient: boolean;
  companies: Company[];
  companyId: string;
  formValue: ClientFormData;
  onAdd: (data: ClientFormData) => void;
  onCancel: () => void;
};

const AddClientForm: React.FC<AddClientFormProps> = props => {
  const { isClient, formValue, companies, onAdd, onCancel } = props;

  const classes = useStyles();

  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [isCompanyShowed, setIsCompanyShowed] = useState(false);
  const [emailDomainList, setEmailDomainList] = useState<EmailDomainModel[]>(
    [],
  );

  React.useEffect(() => {
    if (formValue && formValue.companyId) {
      setSelectedCompanyId(formValue.companyId);
    }
  }, []);

  React.useEffect(() => {
    if (companies && companies.length) {
      const emailList = UserUtil.getEmailDomainList(companies);
      if (emailList && emailList.length) {
        setEmailDomainList(emailList);
      }
    }
  }, [companies]);

  const clearClientSelection = (setFieldValue: SetFieldHandler) => {
    setSelectedCompanyId('');
    setFieldValue('companyName', '');
  };

  const findCompanyWithEmail = (email: string) => {
    if (email && emailDomainList && emailDomainList.length) {
      const matchedDomainItem = emailDomainList.find(
        item =>
          item.emailDomains &&
          item.emailDomains.find(
            emailDomain => emailDomain === UserUtil.getEmailDomain(email),
          ),
      );

      const isFreeEmail = FREE_EMAIL_DOMAIN_LIST.find(
        emailDomain => emailDomain === UserUtil.getEmailDomain(email),
      );
      if (matchedDomainItem && !isFreeEmail) {
        const currentCompany = companies.find(
          company => company.id === matchedDomainItem.companyId,
        );
        if (currentCompany) {
          return currentCompany;
        }
      }
      return false;
    }
    return false;
  };

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    handleChange: ChangeHandler,
    setFieldValue: SetFieldHandler,
  ) => {
    if (isClient) {
      handleChange(event);
      return;
    }
    if (!event.target.value) {
      setIsCompanyShowed(false);
      clearClientSelection(setFieldValue);
      handleChange(event);
      return;
    }
    const currentCompany = findCompanyWithEmail(event.target.value);

    if (currentCompany) {
      setFieldValue('companyName', currentCompany.fields.name);
      setSelectedCompanyId(currentCompany.id);
    } else {
      clearClientSelection(setFieldValue);
    }
    setIsCompanyShowed(true);
    handleChange(event);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        companyName: formValue.companyName || '',
        cognitoEmail: formValue.cognitoEmail || '',
        cognitoFirstName: formValue.cognitoFirstName || '',
        cognitoLastName: formValue.cognitoLastName || '',
      }}
      validationSchema={schema}
      onSubmit={async (values, { setStatus, setSubmitting, setErrors }) => {
        try {
          setStatus({ success: true });
          setSubmitting(false);
          const formData = {
            ...values,
            companyId: selectedCompanyId,
            userId: formValue.userId,
          };
          onAdd(formData);
        } catch (error) {
          setStatus({ success: false });
          setErrors(error);
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box p={3}>
            <Typography
              align="center"
              gutterBottom
              variant="h3"
              color="textPrimary"
            >
              {formValue.userId ? 'Update' : 'New'} User
            </Typography>
          </Box>

          <Box p={3}>
            <Box mb={2}>
              <TextField
                error={Boolean(
                  touched.cognitoFirstName && errors.cognitoFirstName,
                )}
                fullWidth
                helperText={touched.cognitoFirstName && errors.cognitoFirstName}
                label="First name"
                id="client-first-name-input"
                name="cognitoFirstName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cognitoFirstName}
                variant="outlined"
              />
            </Box>
            <Box mb={2}>
              <TextField
                error={Boolean(
                  touched.cognitoLastName && errors.cognitoLastName,
                )}
                fullWidth
                helperText={touched.cognitoLastName && errors.cognitoLastName}
                label="Last name"
                id="client-last-name-input"
                name="cognitoLastName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cognitoLastName}
                variant="outlined"
              />
            </Box>
            <Box>
              <TextField
                error={Boolean(touched.cognitoEmail && errors.cognitoEmail)}
                fullWidth
                helperText={touched.cognitoEmail && errors.cognitoEmail}
                label="Email"
                id="client-email-input"
                name="cognitoEmail"
                onBlur={handleBlur}
                onChange={event =>
                  handleEmailChange(event, handleChange, setFieldValue)
                }
                value={values.cognitoEmail}
                variant="outlined"
              />
            </Box>

            {!isClient && (isCompanyShowed || formValue.userId) && (
              <>
                <Box mt={2}>
                  <CompanySelection
                    values={values}
                    selectedClient={selectedCompanyId}
                    touched={touched}
                    errors={errors}
                    setFieldValue={setFieldValue}
                    handleBlur={handleBlur}
                    handleCompanyIdChange={(companyId: string) =>
                      setSelectedCompanyId(companyId)
                    }
                    handleChange={handleChange}
                    variantValue="outlined"
                  />
                </Box>
              </>
            )}
          </Box>

          <Box p={2} display="flex" alignItems="center">
            <Box flexGrow={1} />
            <Button onClick={onCancel}>Dismiss</Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              color="primary"
              id="confirm-btn"
              className={classes.confirmButton}
            >
              {formValue.userId ? 'Update' : 'Create'}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AddClientForm;
