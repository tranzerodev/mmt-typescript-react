import React, { FunctionComponent, useState } from 'react';
import {
  ValueFormatterParams,
  GridApi,
  GetQuickFilterTextParams,
} from 'ag-grid-community';
import AgGrid from '../AgGrid';
import { Endpoint } from '../../store/endpoints/types';
import { Options } from '../../store/options/types';
import numberWithCommas from '../../data/utils/formatUtils';
import OptionsUtils from '../../utils/OptionsUtils';

interface EndpointSummaryTableProps {
  endpoints: Endpoint[];
  options: Options;
  loadedEndpoints: boolean;
  searchKey: string;
}

const EndpointSummaryTable: FunctionComponent<EndpointSummaryTableProps> = ({
  endpoints,
  options,
  loadedEndpoints,
  searchKey,
}) => {
  const optionUtils = new OptionsUtils(options);

  const [gridTableApi, SetGridTableApi] = useState<GridApi>();

  const onGridReady = (api: GridApi) => {
    if (api) {
      SetGridTableApi(api);
    }
  };

  React.useEffect(() => {
    if (gridTableApi) {
      gridTableApi.setQuickFilter(searchKey);
    }
  }, [searchKey]);

  const rowData = loadedEndpoints ? endpoints : undefined;

  return (
    <>
      <AgGrid
        defaultColDef={{
          suppressMenu: false,
        }}
        columnDefs={[
          {
            headerName: 'Endpoint ID',
            field: 'externalId',
            filter: 'agTextColumnFilter',
            menuTabs: ['filterMenuTab'],
          },
          {
            headerName: 'Group Size',
            field: 'groupSize',
            sortable: true,
            filter: 'agNumberColumnFilter',
          },
          {
            headerName: 'Imp/Hour',
            field: 'hourlyImpressions',
            sortable: true,
            valueFormatter: (p: ValueFormatterParams) =>
              numberWithCommas(p.value),
          },
          {
            headerName: 'Product',
            field: 'endpointType',
            sortable: true,
            getQuickFilterText: (params: GetQuickFilterTextParams) =>
              optionUtils.GetEndpointTypeNames([params.value]),
            valueFormatter: (t: ValueFormatterParams) =>
              optionUtils.GetEndpointTypeNames([t.value]),
          },
          {
            headerName: 'DMA',
            field: 'dma',
            sortable: true,
            getQuickFilterText: (params: GetQuickFilterTextParams) =>
              optionUtils.GetDmaNames([params.value]),
            valueFormatter: (l: ValueFormatterParams) =>
              optionUtils.GetDmaNames([l.value]),
          },
          {
            headerName: 'Latitude',
            field: 'latitude',
          },
          {
            headerName: 'Longitude',
            field: 'longitude',
          },
        ]}
        rowData={rowData}
        overlayLoadingTemplate="Loading Endpoints"
        overlayNoRowsTemplate="No endpoints have been created"
        pagination
        paginationAutoPageSize
        gridLoaded={onGridReady}
      />
    </>
  );
};

export default EndpointSummaryTable;
