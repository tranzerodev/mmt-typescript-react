import React from 'react';
import uniq from 'lodash/uniq';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Button,
  makeStyles,
} from '@material-ui/core';
import { Client, CompanyFormData } from '../../store/clients/types';

const useStyles = makeStyles(theme => ({
  root: {},
  confirmButton: {
    marginLeft: theme.spacing(2),
  },
}));

type AddClientFormProps = {
  clients: Client[];
  formValue: CompanyFormData;
  onAdd: (data: CompanyFormData) => void;
  onCancel: () => void;
};

const AddCompanyForm: React.FC<AddClientFormProps> = props => {
  const { formValue, clients, onAdd, onCancel } = props;
  const classes = useStyles();

  const [companyNameList, setCompanyNameList] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (clients && clients.length) {
      const nameList = clients.map(client => client.companyName);
      // check company id exists, if so, edit mode
      if (formValue.companyId) {
        setCompanyNameList(
          nameList.filter(name => name !== formValue.companyName),
        );
      } else {
        setCompanyNameList(uniq(nameList));
      }
    }
  }, [clients]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        companyName: formValue.companyName || '',
      }}
      validationSchema={Yup.object().shape({
        companyName: Yup.string()
          .max(255)
          .required('Company name is required')
          .notOneOf(companyNameList, 'This company name already exists'),
      })}
      onSubmit={async (values, { setStatus, setSubmitting, setErrors }) => {
        try {
          setStatus({ success: true });
          setSubmitting(false);
          const formData = { ...values, companyId: formValue.companyId };
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
              {formValue.companyId ? 'Update' : 'New'} Company
            </Typography>
          </Box>

          <Box p={3}>
            <TextField
              error={Boolean(touched.companyName && errors.companyName)}
              fullWidth
              helperText={touched.companyName && errors.companyName}
              label="Company name"
              name="companyName"
              id="input-company-name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.companyName}
              variant="outlined"
            />
          </Box>

          <Box p={2} display="flex" alignItems="center">
            <Box flexGrow={1} />
            <Button onClick={onCancel}>Dismiss</Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              color="primary"
              id="company-action"
              className={classes.confirmButton}
            >
              {formValue.companyId ? 'Update' : 'Create'}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AddCompanyForm;
