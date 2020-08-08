import React from 'react';
import { Box, Divider } from '@material-ui/core';
import { StripeInvoice } from '../../../constants/dataTypes';
import { DenseCardContent, PageTitle, TableTitle, FullCard } from '../../UI';
import AgGrid, {
  TimestampFormatter,
  StatusFormatter,
  CentsCurrencyFormatter,
  InvoiceActionRenderer,
} from '../../AgGrid';

interface InvoiceTableProps {
  Invoices?: StripeInvoice[];
}
export const InvoicesTable: React.FC<InvoiceTableProps> = ({
  Invoices = [],
}) => {
  const colDef = [
    {
      headerName: 'Creation Date',
      field: 'created',
      valueFormatter: TimestampFormatter,
      minWidth: 110,
      sortable: true,
      sort: 'desc',
    },
    {
      headerName: 'Status',
      field: 'status',
      valueFormatter: StatusFormatter,
      minWidth: 110,
      sortable: true,
    },
    {
      headerName: 'Amount',
      field: 'amount_due',
      valueFormatter: CentsCurrencyFormatter,
      minWidth: 110,
      sortable: true,
    },
    {
      headerName: 'Actions',
      width: 150,
      suppressSizeToFit: true,
      pinned: 'right',
      cellRenderer: 'invoiceActionRenderer',
    },
  ];

  return (
    <Box display="flex" flexDirection="column">
      <PageTitle title="Invoices" />
      <FullCard variant="outlined">
        <DenseCardContent>
          <AgGrid
            rowData={Invoices}
            columnDefs={colDef}
            frameworkComponents={{
              invoiceActionRenderer: InvoiceActionRenderer,
            }}
            overlayLoadingTemplate="Loading Invoices"
            overlayNoRowsTemplate="No invoices have been created"
            domLayout="autoHeight"
            pagination
            paginationAutoPageSize
          />
        </DenseCardContent>
      </FullCard>
    </Box>
  );
};
