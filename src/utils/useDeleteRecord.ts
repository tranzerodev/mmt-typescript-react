import { useState, useEffect } from 'react';

interface CurrentDataModel {
  id: string;
  data: any;
}

const useDeleteRecord = (deleteAction: any, idField: string) => {
  const initialState = {
    id: '',
    data: null,
  };

  const [currentData, setCurrentData] = useState<CurrentDataModel>(
    initialState,
  );

  const handleClickRemoveBtn = (data: any) => {
    if (data && data[idField]) {
      setCurrentData({
        id: data[idField],
        data,
      });
    }
  };

  const handleClose = () => {
    setCurrentData(initialState);
  };

  const handleConfirm = () => {
    deleteAction(currentData.id);
    handleClose();
  };

  return { currentData, handleClickRemoveBtn, handleClose, handleConfirm };
};

export default useDeleteRecord;
