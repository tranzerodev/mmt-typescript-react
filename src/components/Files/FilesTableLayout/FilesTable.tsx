import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GridApi } from 'ag-grid-community';
import AgGrid, { LocaleDateFormatter } from '../../AgGrid';
import DateUtils from '../../../utils/DateUtils';
import { FileResponse } from '../../../store/files/types';
import {
  getFieldValue,
  userTableNameComparator,
} from '../../../utils/UserUtils';
import UserAvatar from '../../User/UserAvatar';
import ActionButtonModal from '../../Modals/ActionButtonModal';
import { deleteFiles } from '../../../store/files/actions';
import { ConfirmationDrawer } from './ConfirmDrawer';

interface FilesTableProps {
  files: FileResponse[];
  filesLoaded: boolean;
  isLoading: boolean;
  searchKey: string;
}

interface TableSchema {
  creator: {
    avatarUrl: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  fileId: string;
  fileName: string;
  fileUrl: string;
  uploadedDate: string;
}

export const FilesTable: React.FC<FilesTableProps> = props => {
  const dispatch = useDispatch();
  const { files, filesLoaded, searchKey, isLoading } = props;
  const [gridTableApi, setGridTableApi] = useState<GridApi>();
  const [selectedFiles, setSelectedFiles] = useState<TableSchema[]>([]);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(
    false,
  );
  const [isConfirmationDrawerOpen, setIsConfirmationDrawerOpen] = useState<
    boolean
  >(false);

  const filesColumnDefs = [
    {
      headerName: 'Name',
      colId: 'fileName',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      valueGetter: ({
        data,
      }: {
        data: { displayName: string; fileName: string };
      }) => data.displayName || data.fileName,
      sortable: true,
    },
    {
      headerName: 'Creator',
      field: 'creator',
      width: 150,
      cellRendererFramework(criteria: any) {
        return (
          <UserAvatar
            avatarUrl={criteria.value.avatarUrl}
            name={`${criteria.value.firstName} ${criteria.value.lastName}`}
            description={criteria.value.email}
          />
        );
      },
      comparator: userTableNameComparator,
      sortable: true,
    },
    {
      headerName: 'Uploaded',
      field: 'uploadedDate',
      width: 150,
      valueFormatter: LocaleDateFormatter,
      sortable: true,
      comparator: DateUtils.dateComparator,
      sort: 'desc',
    },
  ];

  const onGridReady = (api: GridApi) => {
    if (api) {
      setGridTableApi(api);
    }
  };

  const onSelectionChanged = () => {
    if (!gridTableApi) {
      return;
    }

    const selectedRows: TableSchema[] = gridTableApi.getSelectedRows();
    setSelectedFiles(selectedRows);
    setIsConfirmationDrawerOpen(true);
  };

  const onDeleteFiles = () => {
    setShowConfirmDeleteModal(true);
  };

  const onDownloadFiles = () => {
    const link = document.createElement('a');
    link.setAttribute('download', '');
    link.style.display = 'none';
    document.body.appendChild(link);
    selectedFiles.forEach(selectedFile => {
      link.setAttribute('href', selectedFile.fileUrl);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.click();
    });
    document.body.removeChild(link);
  };

  const handleCloseConfirmDeleteModal = () => setShowConfirmDeleteModal(false);
  const handleConfirmDeleteFiles = () => {
    const filesStaged = files.filter(file =>
      selectedFiles.some(selectedFile => selectedFile.fileId === file.id),
    );

    dispatch(deleteFiles(filesStaged));
    setShowConfirmDeleteModal(false);
    setIsConfirmationDrawerOpen(false);
  };

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setIsConfirmationDrawerOpen(false);
    }
  }, [selectedFiles]);

  useEffect(() => {
    if (gridTableApi) {
      gridTableApi.setQuickFilter(searchKey);
    }
  }, [searchKey]);

  const filesStaged = files.map(file => {
    const creator = {
      firstName: getFieldValue(file.owner, 'given_name'),
      lastName: getFieldValue(file.owner, 'family_name'),
      avatarUrl: getFieldValue(file.owner, 'picture'),
      email: getFieldValue(file.owner, 'email'),
    };
    return {
      fileName: file.fields.fileName,
      creator,
      uploadedDate: file.createdDate,
      fileUrl: file.fields.fileUrl,
      fileId: file.id,
    };
  });

  const rowData = filesLoaded && !isLoading ? filesStaged : undefined;

  return (
    <>
      <ActionButtonModal
        open={showConfirmDeleteModal}
        onClose={handleCloseConfirmDeleteModal}
        positiveAction
        onPositiveActionPerformed={handleConfirmDeleteFiles}
        label={`Delete file${selectedFiles.length > 1 ? 's' : ''}`}
        title={`Delete file${selectedFiles.length > 1 ? 's' : ''}`}
        positiveActionText="Confirm"
        mainComponent={`Are you sure you want to delete file${
          selectedFiles.length > 1 ? 's' : ''
        }`}
      />
      <AgGrid
        rowData={rowData}
        columnDefs={filesColumnDefs}
        onSelectionChanged={onSelectionChanged}
        rowHeight={60}
        rowSelection="multiple"
        overlayLoadingTemplate="Loading Files"
        overlayNoRowsTemplate="No files have been uploaded"
        pagination
        paginationAutoPageSize
        suppressCellSelection
        suppressRowClickSelection
        gridLoaded={onGridReady}
      />
      <ConfirmationDrawer
        onDelete={onDeleteFiles}
        onDownload={onDownloadFiles}
        open={isConfirmationDrawerOpen}
        selected={selectedFiles.length}
        selectedLabel="File"
      />
    </>
  );
};
