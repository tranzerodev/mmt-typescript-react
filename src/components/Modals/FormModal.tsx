import * as React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Dialog,
  Typography,
  Button,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { AppThunkAction } from '../../store';
import { NewButton } from '../UI';

interface FormBodyAPI {
  touched: any;
  errors: any;
  handleBlur: any;
  handleChange: any;
  values: any;
}

interface FormModalProps {
  entityName: string;
  open?: boolean;
  newButton?: boolean;
  initialFormValue: any;
  saveAction: (values: any) => AppThunkAction;
  useFormHook: () => {
    validationScheme: Yup.ObjectSchema;
    getSubmitValues: () => Promise<any>; // this method can be specified in the form to get any extra values that might be needed during submit api call
    FormRenderer: (props: FormBodyAPI) => React.ReactNode;
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    confirmButton: {
      marginLeft: theme.spacing(2),
    },
  }),
);

export const FormModal: React.FC<FormModalProps> = React.memo(
  ({
    entityName,
    initialFormValue,
    saveAction,
    useFormHook,
    newButton = false,
    open = false,
  }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { validationScheme, getSubmitValues, FormRenderer } = useFormHook();
    const [modalState, setModalState] = React.useState({
      formValue: initialFormValue,
      open: false,
    });

    const openModal = () => {
      setModalState({
        formValue: initialFormValue,
        open: true,
      });
    };

    const resetModal = () => {
      setModalState({
        formValue: initialFormValue,
        open: false,
      });
    };

    const closeModal = () => {
      resetModal();
    };

    const onFormSubmit = async (values: any) => {
      const extraValues = await getSubmitValues();
      await dispatch(saveAction({ ...values, ...extraValues }));
    };

    return (
      <>
        {newButton && (
          <NewButton htmlId={`btn-create-${entityName}`} onClick={openModal}>
            New {entityName}
          </NewButton>
        )}
        <Dialog
          maxWidth="sm"
          fullWidth
          onClose={closeModal}
          open={modalState.open || open}
        >
          <Formik
            enableReinitialize
            initialValues={{ ...modalState.formValue.fields }}
            validationSchema={validationScheme}
            onSubmit={onFormSubmit}
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
                    {modalState.formValue.id ? 'Update' : 'New'} {entityName}
                  </Typography>
                </Box>
                {FormRenderer({
                  touched,
                  errors,
                  handleBlur,
                  handleChange,
                  values,
                })}
                <Box p={2} display="flex" alignItems="center">
                  <Box flexGrow={1} />
                  <Button onClick={closeModal}>Dismiss</Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    color="primary"
                    id="company-action"
                    className={classes.confirmButton}
                  >
                    {modalState.formValue.id ? 'Update' : 'Create'}
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Dialog>
      </>
    );
  },
);
