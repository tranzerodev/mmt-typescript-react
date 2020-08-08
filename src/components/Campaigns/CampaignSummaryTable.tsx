import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { styled, Box } from '@material-ui/core';
import arrayMove from 'array-move';
import * as ReduxType from '../../store/reduxTypes';
import ActionButtonModal from '../Modals/ActionButtonModal';
import useDeleteRecord from '../../utils/useDeleteRecord';
import { Campaign } from '../../store/campaigns/types';
import { listClients } from '../../store/clients/actions';
import { openAuthModal } from '../../store/ui/actions';
import AgGrid, {
  LocaleDateFormatter,
  CurrencyFormatter,
  CampaignActionRenderer,
} from '../AgGrid';
import { deleteCampaign as deleteCampaignAction } from '../../store/campaigns/actions';
import { CampaignNameRenderer } from '../AgGrid/Renderer';
import * as UserUtils from '../../utils/UserUtils';
import { CAMPAIGN_STATUSES } from '../../constants/stringConsts';
import { AllClientSelectValue } from '../Create/ClientSelect';

const TableContainer = styled(Box)({
  '& .ag-center-cols-viewport': {
    overflow: 'hidden',
  },
});

interface CampaignSummaryTableProps {
  campaigns: Campaign[];
}

const mapStateToProps = (state: ReduxType.RootState) => ({
  isLoading: state.campaigns.isLoading,
  isListLoaded: state.campaigns.isListLoaded,
  error: state.campaigns.error,
  userId: state.user && state.user.id,
  user: state.user,
  clients: state.clients.clients,
  loadedClients: state.clients.loadedClients,
  loadingClients: state.clients.isLoading,
});

const mapDispatchToProps = (dispatch: ReduxType.AppThunkDispatch) => ({
  deleteCampaign: (campaignId: string, userId: string) =>
    dispatch(deleteCampaignAction(campaignId, userId)),
  openSignUpModal: () => dispatch(openAuthModal('signUp')),
  getClients: () => dispatch(listClients()),
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

const CampaignSummaryTable: React.FC<
  CampaignSummaryTableProps & PropsFromRedux
> = props => {
  const {
    user,
    userId,
    deleteCampaign,
    openSignUpModal,
    campaigns = [],
    isListLoaded,
    clients,
    loadedClients,
    loadingClients,
    getClients,
  } = props;

  React.useEffect(() => {
    if (!loadedClients && !loadingClients) {
      getClients();
    }
  });

  const clientIdToName: Record<string, string> = {};
  clients.forEach(c => {
    clientIdToName[c.companyId] = c.companyName;
  });

  const deletingCampaign = (id: string) => deleteCampaign(id, userId);

  const {
    currentData,
    handleClickRemoveBtn,
    handleClose,
    handleConfirm,
  } = useDeleteRecord(deletingCampaign, 'id');

  const handleRemoveBtn = (data: any) => {
    if (user.isUnAuth) {
      openSignUpModal();
    } else {
      handleClickRemoveBtn(data);
    }
  };

  const statusFormatter = (startDate: Date, endDate: Date) => {
    const today = new Date();
    if (today > endDate) {
      return CAMPAIGN_STATUSES.COMPLETE;
    }
    if (today >= startDate && today <= endDate) {
      return CAMPAIGN_STATUSES.LIVE;
    }
    if (today < startDate) {
      return CAMPAIGN_STATUSES.NOT_STARTED;
    }
    return null;
  };

  let columnDefs = [
    {
      headerName: 'Name',
      colId: 'name',
      suppressSizeToFit: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      valueGetter: ({
        data,
      }: {
        data: { displayName: string; name: string };
      }) => data.displayName || data.name,
      sortable: true,
    },
    {
      headerName: 'Budget',
      field: 'budget',
      valueFormatter: CurrencyFormatter,
      sortable: true,
    },
    {
      headerName: 'Start Date',
      field: 'startDate',
      valueFormatter: LocaleDateFormatter,
      sortable: true,
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      valueFormatter: LocaleDateFormatter,
      sortable: true,
    },
    {
      headerName: 'Created Date',
      field: 'createdDate',
      sort: 'desc',
      valueFormatter: LocaleDateFormatter,
      sortable: true,
    },
    {
      headerName: 'Action',
      pinned: 'right',
      suppressSizeToFit: true,
      cellRendererFramework(params: any) {
        return (
          <CampaignActionRenderer
            handleRemoveBtnClick={() => handleRemoveBtn(params.data)}
            data={params.data}
          />
        );
      },
    },
  ];

  if (UserUtils.IsClient(user)) {
    columnDefs = [
      {
        headerName: 'Status',
        field: 'status',
        width: 120,
        valueFormatter: (val: {
          data: { startDate: string; endDate: string };
        }) =>
          statusFormatter(
            new Date(val.data.startDate),
            new Date(val.data.endDate),
          ),
        suppressSizeToFit: true,
        sortable: true,
      },
    ].concat(columnDefs);
    columnDefs = arrayMove(columnDefs, 1, 0);
  } else {
    columnDefs = [
      {
        headerName: 'Client',
        field: 'client',
        sortable: true,
      },
      {
        headerName: 'Source',
        field: 'source',
        suppressSizeToFit: true,
        sortable: true,
      },
    ].concat(columnDefs);
    columnDefs = arrayMove(columnDefs, 2, 0);
  }

  const formattedCampaigns = campaigns.map(c => ({
    ...c,
    client:
      c.customer === AllClientSelectValue
        ? 'All'
        : clientIdToName[c.customer] || c.customer,
  }));
  const rowData =
    isListLoaded && loadedClients ? formattedCampaigns : undefined;

  return (
    <TableContainer>
      {currentData && currentData.id && (
        <ActionButtonModal
          open={!!currentData.id}
          onClose={handleClose}
          onPositiveActionPerformed={handleConfirm}
          label="Delete campaign"
          title="Delete campaign"
          positiveActionText="Confirm"
          positiveAction
          mainComponent={`Are you sure you want to delete ${
            currentData.data.name
          }?`}
        />
      )}
      <AgGrid
        frameworkComponents={{
          campaignNameRenderer: CampaignNameRenderer,
        }}
        columnDefs={columnDefs}
        overlayLoadingTemplate="Loading Campaigns"
        overlayNoRowsTemplate="No campaigns have been created"
        rowData={rowData}
        suppressCellSelection
        rowSelection="multiple"
        suppressRowClickSelection
        domLayout="autoHeight"
        pagination
        paginationPageSize={3}
      />
    </TableContainer>
  );
};

export default connector(CampaignSummaryTable);
