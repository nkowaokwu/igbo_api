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
      className="bg-white border-current border-solid border border-gray-200 max-h-full h-8/12 w-full lg:w-10/12 p-12 rounded-lg shadow-lg overflow-scroll text-gray-800"
    >
      {!resultStatus ? (
        <>
          <div className="flex justify-between">
            <h1 className="text-2xl">{modalTitle}</h1>
            <button type="button" onClick={handleClose}>
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
    </Modal>
  );
};

EditModal.propTypes = {
  title: PropTypes.string.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.any.isRequired, // eslint-disable-line
};

export default EditModal;
