import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Grid } from '@material-ui/core';
import CompaniesTable from '../../components/CompaniesTable';
import {
  PageContent,
  FullCard,
  DenseCardContent,
  NewButton,
  PageTitle,
} from '../../components/UI';
import { listClients, listCompanyClients } from '../../store/clients/actions';
import * as ReduxType from '../../store/reduxTypes';
import * as UserUtils from '../../utils/UserUtils';
import {
  CompanyFormData,
  CompanyTableRowModal,
} from '../../store/clients/types';
import NewCompanyModal from '../../components/Companies/NewCompanyModal';

const mapStateToProps = (state: ReduxType.RootState) => ({
  user: state.user,
  companies: state.clients.companies,
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

interface CompanyModalModel {
  formValue: CompanyFormData;
  open: boolean;
}

type PropsFromRedux = ConnectedProps<typeof connector>;

const CompaniesPage: React.FC<PropsFromRedux> = props => {
  const {
    user,
    companies,
    isClientsLoading,
    loadedClients,
    getClients,
    getCompanyClients,
  } = props;

  const initialCompany = {
    companyId: '',
    companyName: '',
  };

  const [modal, setModal] = React.useState<CompanyModalModel>({
    formValue: initialCompany,
    open: false,
  });

  React.useEffect(() => {
    const userCompanyId = UserUtils.getCompanyId(user);

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
      formValue: initialCompany,
      open: false,
    });
  };

  const openCompanyModal = (data?: CompanyTableRowModal) => {
    if (data && data.companyId) {
      const formData = {
        companyId: data.companyId,
        companyName: data.company,
      };
      setModal({
        formValue: formData,
        open: true,
      });
    } else {
      setModal({
        ...modal,
        open: true,
      });
    }
  };

  const handleModalClose = () => {
    resetModal();
  };

  const handleAddCompany = (status: boolean) => {
    if (status) {
      resetModal();
    }
  };

  return (
    <PageContent>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <PageTitle title="Companies" />
        <NewButton onClick={openCompanyModal} htmlId="btn-new-company">
          New Company
        </NewButton>
      </Grid>
      <FullCard variant="outlined">
        <DenseCardContent>
          <CompaniesTable
            companies={companies}
            loadedClients={loadedClients}
            openModal={openCompanyModal}
          />
        </DenseCardContent>
        <NewCompanyModal
          formValue={modal.formValue}
          onAdd={handleAddCompany}
          onCancel={handleModalClose}
          open={modal.open}
        />
      </FullCard>
    </PageContent>
  );
};

export default connector(CompaniesPage);
