import * as React from 'react';
import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import AgGrid from '../AgGrid';
import { EndpointTypes } from '../../store/options/types';

const TableContainer = styled(Box)({
  height: '100%',
});

interface ProductSummaryTableProps {
  products: EndpointTypes[];
  loadedProducts: boolean;
}

const ProductSummaryTable: React.FC<ProductSummaryTableProps> = ({
  products,
  loadedProducts,
}) => {
  const rowData = loadedProducts ? products : undefined;

  return (
    <TableContainer>
      <AgGrid
        defaultColDef={{
          suppressMenu: false,
        }}
        columnDefs={[
          {
            headerName: 'Name',
            field: 'Name',
            filter: 'agTextColumnFilter',
            menuTabs: ['filterMenuTab'],
            sortable: true,
          },
          {
            headerName: 'Endpoint Category',
            field: 'Endpoint Category',
            filter: 'agTextColumnFilter',
            menuTabs: ['filterMenuTab'],
            sortable: true,
          },
          {
            headerName: 'Dimension - X',
            field: 'Dimension - Width',
            sortable: true,
          },
          {
            headerName: 'Dimension - Y',
            field: 'Dimension - Height',
            sortable: true,
          },
          {
            headerName: 'Resolution - X',
            field: 'Resolution - Width',
            sortable: true,
          },
          {
            headerName: 'Resolution - Y',
            field: 'Resolution - Height',
            sortable: true,
          },
          {
            headerName: 'Spot Length',
            field: 'Spot Length',
            sortable: true,
          },
        ]}
        rowData={rowData}
        overlayLoadingTemplate="Loading Products"
        overlayNoRowsTemplate="No products have been created"
        pagination
        paginationAutoPageSize
      />
    </TableContainer>
  );
};

export default ProductSummaryTable;
