import * as React from 'react';
import { GridReadyEvent } from 'ag-grid-community';
import { useDispatch } from 'react-redux';
import AgGrid, { LocaleDateFormatter, ClientActionRenderer } from '../AgGrid';
import { CompanyTableRowModal, Company } from '../../store/clients/types';
import DateUtils from '../../utils/DateUtils';
import useDeleteRecord from '../../utils/useDeleteRecord';
import { ActionButtonModal } from '../Modals';
import { deleteCompany } from '../../store/clients/actions';

interface CompaniesTableProps {
  companies: Company[];
  loadedClients: boolean;
  openModal: (data: CompanyTableRowModal) => void;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  loadedClients,
  openModal,
}) => {
  const openCompanyModal = (data: CompanyTableRowModal) => {
    openModal(data);
  };

  const dispatch = useDispatch();

  const handleDelete = (companyId: string) => {
    const deletedCompany = companies.find(company => company.id === companyId);
    if (deletedCompany) {
      dispatch(deleteCompany(deletedCompany));
    }
  };

  const {
    currentData,
    handleClickRemoveBtn,
    handleClose,
    handleConfirm,
  } = useDeleteRecord(handleDelete, 'companyId');

  const clientColumnDefs = [
    {
      headerName: 'Company',
      field: 'company',
      width: 150,
      sortable: true,
    },
    {
      headerName: 'Creation Date',
      field: 'registeredDate',
      width: 150,
      valueFormatter: LocaleDateFormatter,
      sortable: true,
      comparator: DateUtils.dateComparator,
    },
    {
      headerName: 'Actions',
      width: 150,
      suppressSizeToFit: true,
      pinned: 'right',
      cellRendererFramework(params: any) {
        return (
          <ClientActionRenderer
            handleClickRemove={() => handleClickRemoveBtn(params.data)}
            handleClickEdit={() => openCompanyModal(params.data)}
            data={params}
          />
        );
      },
    },
  ];

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
    const defaultSortModel = [{ colId: 'registeredDate', sort: 'desc' }];
    params.api.setSortModel(defaultSortModel);
  };

  const formattedClients = companies
    .filter((company: Company) => company.id !== '')
    .map((company: Company) => ({
      company: company.fields.name,
      registeredDate: company.createdDate,
      companyId: company.id,
    }));

  const rowData = loadedClients ? formattedClients : undefined;

  return (
    <>
      {currentData && currentData.id && (
        <ActionButtonModal
          open={!!currentData.id}
          onClose={handleClose}
          positiveAction
          onPositiveActionPerformed={handleConfirm}
          label="Delete Company"
          title="Delete Company"
          positiveActionText="Confirm"
          mainComponent={`Are you sure you want to delete ${
            currentData.data.company
          }?`}
        />
      )}
      <AgGrid
        rowData={rowData}
        columnDefs={clientColumnDefs}
        rowHeight={60}
        rowSelection="multiple"
        overlayLoadingTemplate="Loading Companies"
        overlayNoRowsTemplate="No companies have been created"
        pagination
        paginationAutoPageSize
        onGridReady={onGridReady}
      />
    </>
  );
};

export default CompaniesTable;
