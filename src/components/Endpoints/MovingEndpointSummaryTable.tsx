import React, { FunctionComponent } from 'react';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  GridReadyEvent,
  ValueFormatterParams,
  ColDef,
} from 'ag-grid-community';
import AgGrid from '../AgGrid';
import { MovingEndpoint } from '../../store/endpoints/types';
import numberWithCommas from '../../data/utils/formatUtils';
import DateUtils from '../../utils/DateUtils';
import { Month } from '../../constants/models';

const useStyles = makeStyles(() =>
  createStyles({
    movingEndpointBox: {
      height: '100%',
      '& .ag-header-group-cell-label': {
        'font-weight': 'bold',
        'justify-content': 'center',
      },
    },
    boldColumn: {
      'font-weight': 'bold',
    },
  }),
);

const getHeaderMonthsOutlook = () => {
  const headerMonths: ColDef[] = [];
  const nextMonths: Month[] = DateUtils.getNextMonthsByPeriod(5);

  nextMonths.forEach((month, index) => {
    headerMonths.push({
      headerName: month.name,
      field: `month_${index + 1}`,
      sortable: true,
      valueFormatter: (p: ValueFormatterParams) =>
        numberWithCommas(p.value) as any,
    });
  });

  return headerMonths;
};

interface MovingEndpointSummaryTableProps {
  movingEndpoints: MovingEndpoint[];
  loadedMovingEndpoints: boolean;
}

const MovingEndpointSummaryTable: FunctionComponent<
  MovingEndpointSummaryTableProps
> = ({ movingEndpoints = [], loadedMovingEndpoints }) => {
  const classes = useStyles();
  const rowData = loadedMovingEndpoints ? movingEndpoints : undefined;

  return (
    <Box classes={{ root: classes.movingEndpointBox }}>
      <AgGrid
        defaultColDef={{
          suppressMenu: false,
        }}
        autoGroupColumnDef={{
          headerName: 'Region',
          width: 300,
          callRendererParams: {
            suppresscount: true,
          },
          headerClass: classes.boldColumn,
        }}
        columnDefs={[
          {
            headerName: 'Imp/Hr',
            field: 'hourlyImpressions',
            filter: 'agTextColumnFilter',
            menuTabs: ['filterMenuTab'],
            sortable: true,
            valueFormatter: (p: ValueFormatterParams) =>
              numberWithCommas(p.value),
            headerClass: classes.boldColumn,
          },
          {
            headerName: 'Available Hours by Month',
            cellStyle: { textAlign: 'center' },
            children: getHeaderMonthsOutlook(),
          },
        ]}
        rowData={rowData}
        getDataPath={(row: any) => row.treePath}
        overlayLoadingTemplate="Loading Moving Endpoints"
        overlayNoRowsTemplate="No moving endpoints have been created"
        groupDefaultExpanded={-1}
        pagination
        paginationAutoPageSize
        treeData
        onGridReady={(params: GridReadyEvent) => params.api.collapseAll()}
      />
    </Box>
  );
};

export default MovingEndpointSummaryTable;
