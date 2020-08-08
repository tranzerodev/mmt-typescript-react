import { useState } from 'react';
import { EndpointFormValueType } from '../../store/endpoints/types';

const useEndpointFormSet = () => {
  const initFormValue: EndpointFormValueType = {
    dailyUTCStartTime: new Date('Jan 1, 2006').setHours(0, 0, 0, 0),
    dailyUTCendTime: new Date('Jan 1, 2006').setHours(23, 59, 59, 999),
  };
  const [currentData, setCurrentData] = useState<EndpointFormValueType>(
    initFormValue,
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const onCancel = () => {
    setIsOpenModal(false);
    setCurrentData(initFormValue);
  };

  return [currentData, isOpenModal, onCancel, setIsOpenModal];
};

export default useEndpointFormSet;
