import React from 'react';
import styled from 'styled-components';
import { AgGridReact } from 'ag-grid-react';
import { withStyles } from '@material-ui/core';
import { GridReadyEvent, GridApi, ColDef } from 'ag-grid-community';

import * as AdGridCss from '../../../externalStyles/Table.scss';
import HeaderRender from './HeaderRender';

const GridContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const baseDefaultColDef = {
  sortable: false,
  suppressMenu: true,
};

interface TableProps {
  sidebarType: string;
  rowData: Array<Record<string, any>>;
  columnDefs: Array<ColDef>;
  defaultColDef: ColDef;
  gridLoaded: (gridApi: GridApi) => void;
  enableCellTextSelection: boolean;
  rowSelection: string;
  rowHeight?: number;
}

const Table: React.FC<TableProps> = props => {
  // let gridApi = null;
  // let gridColumnApi = null;

  const {
    defaultColDef,
    sidebarType,
    gridLoaded,
    enableCellTextSelection,
    rowData,
    columnDefs,
    rowSelection,
    rowHeight,
    ...tableProps
  } = props;

  const onGridReady = (params: GridReadyEvent) => {
    // gridApi = params.api;
    // gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });

    params.api.sizeColumnsToFit();
    if (gridLoaded) {
      return gridLoaded(params.api);
    }
    return null;
  };

  const frameworkComponents = {
    agColumnHeader: HeaderRender,
  };

  const baseColDef = { ...baseDefaultColDef, ...defaultColDef };
  let sideBarDef;
  if (sidebarType === 'columnBasic') {
    sideBarDef = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressSideButtons: true,
            suppressColumnFilter: true,
            suppressColumnSelectAll: true,
            suppressColumnExpandAll: true,
          },
        },
      ],
    };
  }
  return (
    <GridContainer className="ag-theme-material">
      <AgGridReact
        rowHeight={rowHeight}
        headerHeight={rowHeight}
        defaultColDef={baseColDef}
        frameworkComponents={frameworkComponents}
        columnDefs={columnDefs}
        sideBar={sideBarDef}
        onGridReady={onGridReady}
        suppressScrollOnNewData
        suppressAggFuncInHeader
        overlayLoadingTemplate="<span>Loading data</span>"
        overlayNoRowsTemplate="<span>This table is empty</span>"
        suppressContextMenu
        rowData={rowData}
        rowSelection={rowSelection}
        enableCellTextSelection={enableCellTextSelection}
        {...tableProps}
      />
    </GridContainer>
  );
};

Table.defaultProps = {
  defaultColDef: baseDefaultColDef,
  sidebarType: 'noSidebar',
  enableCellTextSelection: true,
  rowSelection: 'multiple',
  rowHeight: 60,
};

export default withStyles(AdGridCss)(Table);
