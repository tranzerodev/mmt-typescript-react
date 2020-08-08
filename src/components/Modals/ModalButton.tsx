import React, { useState } from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { connect } from 'react-redux';
import SimpleModal, { SimpleModalPropType } from './SimpleModal';
import { openAuthModal } from '../../store/ui/actions';

type ModalButtonPropType = SimpleModalPropType &
  ButtonProps & {
    text?: string;
    completeButtonText?: string;
    onCompleteClick?: () => Promise<any>;
    onOpenClick?: () => boolean;
    openSignupModal?: () => void;
    user?: object;
  };

const ModalButton: React.FC<ModalButtonPropType> = ({
  text = 'Open',
  color = 'default',
  variant = 'outlined',
  mainComponent = null,
  footerComponent = null,
  completeButtonText = null,
  onCompleteClick = null,
  onOpenClick = null,
  showSpinner = false,
  authRequired = false,
  // eslint-disable-next-line func-names
  openSignupModal = function() {
    return null;
  },
  user = null,
  ...modalProps
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (user && user.isUnAuth && authRequired) {
      openSignupModal();
      return;
    }
    if (onOpenClick) {
      const shouldOpen = onOpenClick();
      if (!shouldOpen) {
        return;
      }
    }

    setOpen(true);
  };

  const handleClose = () => {
    if (showSpinner) {
      return;
    }

    setOpen(false);
  };

  const handleComplete = async () => {
    if (onCompleteClick) {
      await onCompleteClick();
    }

    handleClose();
  };

  let footer = null;
  if (footerComponent) {
    footer = footerComponent;
  } else if (completeButtonText) {
    footer = (
      <Button variant={variant} color={color} onClick={handleComplete}>
        {completeButtonText}
      </Button>
    );
  }

  let main = null;
  if (mainComponent && typeof mainComponent !== 'string') {
    main = React.cloneElement(mainComponent, {
      handleClose,
    });
  }

  return (
    <div>
      <Button onClick={handleOpen} variant={variant} color={color}>
        {text}
      </Button>
      <SimpleModal
        open={open}
        onClose={handleClose}
        mainComponent={main}
        footerComponent={footer}
        showSpinner={showSpinner}
        {...modalProps}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  openSignupModal: () => dispatch(openAuthModal('signUp')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalButton);
