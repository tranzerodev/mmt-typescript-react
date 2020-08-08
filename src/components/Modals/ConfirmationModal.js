import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Modal } from 'react-bootstrap';
import Button from '../Buttons';

const ConfirmationModal = ({
  showModal,
  title,
  message,
  errors,
  handleConfirm,
  handleClose,
}) => (
  <Modal show={showModal} onHide={handleClose}>
    <Modal.Header>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {errors && errors.length ? (
        errors.map((error, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Alert key={idx} bsStyle="danger">
            {error}
          </Alert>
        ))
      ) : (
        <span>{message}</span>
      )}
    </Modal.Body>
    {errors && errors.length ? (
      <Modal.Footer>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    ) : (
      <Modal.Footer>
        <Button onClick={handleClose}>No</Button>
        <Button buttonClasses={['primary']} onClick={handleConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    )}
  </Modal>
);

ConfirmationModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  handleConfirm: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

ConfirmationModal.defaultProps = {
  errors: [],
};

export default ConfirmationModal;
