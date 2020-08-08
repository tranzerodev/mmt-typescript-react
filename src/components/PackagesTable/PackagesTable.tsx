import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import useDeleteRecord from '../../utils/useDeleteRecord';
import AgGrid, {
  LocaleDateFormatter,
  CurrencyFormatter,
  ActionsRenderer,
} from '../AgGrid';
import ActionButtonModal from '../Modals/ActionButtonModal';
import * as ReduxType from '../../store/reduxTypes';
import { Package } from '../../store/packages/types';
import { listClients } from '../../store/clients/actions';
import { AllClientSelectValue } from '../Create/ClientSelect';

interface PackagesTableProps {
  packages: Package[];
  loadedPackages: boolean;
  deletePackage: (id: string) => void;
}

const mapStateToProps = (state: ReduxType.RootState) => ({
  clients: state.clients.clients,
  loadedClients: state.clients.loadedClients,
  loadingClients: state.clients.isLoading,
});

const mapDispatchToProps = (dispatch: ReduxType.AppThunkDispatch) => ({
  getClients: () => dispatch(listClients()),
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

const PackagesTable: React.FC<PackagesTableProps & PropsFromRedux> = ({
  packages,
  loadedPackages,
  clients,
  loadedClients,
  loadingClients,
  getClients,
  deletePackage,
}) => {
  React.useEffect(() => {
    if (!loadedClients && !loadingClients) {
      getClients();
    }
  });
  const {
    currentData,
    handleClickRemoveBtn,
    handleClose,
    handleConfirm,
  } = useDeleteRecord(deletePackage, 'id');

  const clientIdToName: Record<string, string> = {};
  clients.forEach(c => {
    clientIdToName[c.companyId] = c.companyName;
  });

  const packageColumnDefs = [
    // {
    //   checkboxSelection: true,
    //   minWidth: 50,
    //   cellClass: ['select-cell'],
    // },
    {
      headerName: 'Name',
      field: 'name',
      minWidth: 160,
      sortable: true,
    },
    {
      headerName: 'Client',
      field: 'customer',
      minWidth: 160,
      sortable: true,
    },
    // {
    //   headerName: 'Section',
    //   field: 'Section',
    //   minWidth: 110,
    //   sortable: true,
    // },
    {
      headerName: 'Budget',
      field: 'budget',
      valueFormatter: CurrencyFormatter,
      minWidth: 110,
      sortable: true,
    },
    {
      headerName: 'Start',
      field: 'startDate',
      valueFormatter: LocaleDateFormatter,
      minWidth: 110,
      sortable: true,
    },
    {
      headerName: 'End',
      field: 'endDate',
      valueFormatter: LocaleDateFormatter,
      minWidth: 110,
      sortable: true,
    },
    {
      headerName: 'Creation Date',
      field: 'createdDate',
      valueFormatter: LocaleDateFormatter,
      minWidth: 110,
      sortable: true,
      sort: 'desc',
    },
    // {
    //   headerName: 'Images',
    //   field: 'Images - Secondary',
    //   cellClass: ['image-renderer'],
    //   minWidth: 110,
    //   cellRendererFramework(params: any) {
    //     return <ImageRenderer value={params.value} />;
    //   },
    // },
    {
      headerName: 'Actions',
      width: 150,
      suppressSizeToFit: true,
      pinned: 'right',
      cellRendererFramework(params: any) {
        return (
          <ActionsRenderer
            removeItem={() => handleClickRemoveBtn(params.data)}
            params={params}
          />
        );
      },
    },
  ];

  // somehow we are getting some undefined package value
  const formattedPackages = packages
    .filter(p => p !== undefined)
    .map(p => ({
      ...p,
      customer:
        p.customer === AllClientSelectValue
          ? 'All'
          : clientIdToName[p.customer] || p.customer,
    }));

  const rowData =
    loadedPackages && loadedClients ? formattedPackages : undefined;

  return (
    <>
      {currentData && currentData.id && (
        <ActionButtonModal
          open={!!currentData.id}
          onClose={handleClose}
          positiveAction
          onPositiveActionPerformed={handleConfirm}
          label="Delete package"
          title="Delete package"
          positiveActionText="Confirm"
          mainComponent={`Are you sure you want to delete ${
            currentData.data.Name
          }?`}
        />
      )}
      <AgGrid
        rowData={rowData}
        columnDefs={packageColumnDefs}
        rowSelection="multiple"
        overlayLoadingTemplate="Loading Packages"
        overlayNoRowsTemplate="No packages have been created"
        pagination
        paginationAutoPageSize
      />
    </>
  );
};

export default connector(PackagesTable);
