import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const Icon = ({ status }) => {
  switch (status) {
    case 'success':
      return <FontAwesomeIcon icon={faCheckCircle} color="green" size="6x" />;
    case 'error':
      return <FontAwesomeIcon icon={faTimesCircle} color="red" size="6x" />;
    default:
      return <></>;
  }
};

Icon.propTypes = {
  status: PropTypes.string.isRequired,
};

const Result = ({
  status,
  title,
  subtitle,
  back,
}) => (
  <div className="flex flex-col w-full justify-center items-center">
    <Icon status={status} />
    <h2 className="text-gray-800 text-2xl mt-5">{title}</h2>
    <h3 className="text-gray-600 text-l mt-5">{subtitle}</h3>
    <button
      className="border-current border-solid border border-green-600 py-2 px-3 rounded text-green-500 mt-5"
      type="button"
      onClick={back}
    >
      Back to Form
    </button>
  </div>
);

Result.propTypes = {
  status: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  back: PropTypes.func,
};

Result.defaultProps = {
  title: 'Title',
  subtitle: 'Subtitle',
  back: () => {},
};

export default Result;
