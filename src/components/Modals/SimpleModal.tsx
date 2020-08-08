import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import CloseIcon from '@material-ui/icons/Close';
import { Modal, IconButton, styled } from '@material-ui/core';
import s from './SimpleModal.css';
import { SpinnerContainer } from '../Loading';

const CloseModalIcon = styled(IconButton)({
  '&&': {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 0,
    padding: '4px',
  },
});

export type SimpleModalPropType = {
  label: string;
  description?: string;
  onClose: () => void;
  title?: string;
  mainComponent?: React.ReactElement | string;
  footerComponent?: React.ElementType;
  showSpinner?: boolean;
  closeButton?: boolean;
  open: boolean;
};

const SimpleModal: React.FC<SimpleModalPropType> = ({
  label,
  onClose,
  description = 'Modal',
  title = null,
  mainComponent = null,
  footerComponent = null,
  showSpinner = false,
  closeButton = false,
  ...modalProps
}) => (
  <Modal
    aria-labelledby={label}
    aria-describedby={description}
    onClose={onClose}
    {...modalProps}
  >
    <div className={s.container}>
      {title && (
        <div className={s.modalHeader}>
          <div className={s.title}>{title}</div>
          {closeButton && (
            <CloseModalIcon onClick={() => onClose()}>
              <CloseIcon />
            </CloseModalIcon>
          )}
        </div>
      )}
      <div className={s.modalBody}>{mainComponent}</div>
      {footerComponent && (
        <div className={s.modalFooter}>{footerComponent}</div>
      )}
      {showSpinner && <SpinnerContainer cover />}
    </div>
  </Modal>
);

export default withStyles(s)(SimpleModal);
