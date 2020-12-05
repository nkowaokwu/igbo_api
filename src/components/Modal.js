import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Result from './Result';
import ExitIcon from '../assets/icons/exit.svg';

const EditModal = ({
  title: modalTitle,
  onRequestClose,
  isOpen,
  children,
  ...rest
}) => {
  const [resultStatus, setResultStatus] = useState(null);
  const [resultTitle, setResultTitle] = useState('');
  const [resultSubTitle, setResultSubTitle] = useState('');

  const onSuccess = ({ title = 'Success!', subtitle = '' } = {}) => {
    setResultStatus('success');
    setResultTitle(title);
    setResultSubTitle(subtitle);
  };
  const onFailure = ({ title = 'An error has occurred', subtitle = '' } = {}) => {
    setResultStatus('error');
    setResultTitle(title);
    setResultSubTitle(subtitle);
  };

  const handleClose = () => {
    setResultStatus(null);
    onRequestClose();
  };

  return (
    <Modal
      title={modalTitle}
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel={modalTitle}
      style={{
        overlay: {
          backgroundColor: 'rgba(55, 162, 105, .1)',
        },
      }}
      {...rest}
    >
      <div data-test="suggestion-modal">
        {!resultStatus ? (
          <>
            <div className="flex justify-between">
              <h1 className="text-2xl">{modalTitle}</h1>
              <button data-test="modal-exit-button" type="button" onClick={handleClose}>
                <ExitIcon />
              </button>
            </div>
            {React.Children.map(children, (child) => (
              React.cloneElement(child, { onRequestClose, onSuccess, onFailure })
            ))}
          </>
        ) : (
          <>
            <div className="flex justify-end">
              <button type="button" onClick={handleClose}>
                <ExitIcon />
              </button>
            </div>
            <Result
              status={resultStatus}
              title={resultTitle}
              subtitle={resultSubTitle}
              back={() => setResultStatus(null)}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

EditModal.propTypes = {
  title: PropTypes.string.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.any.isRequired, // eslint-disable-line
  rest: PropTypes.any, // eslint-disable-line
};

export default EditModal;
