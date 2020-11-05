import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import useEventListener from '../hooks/useEventListener';

const Select = ({ ContainerComponent, options, className }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const selectRef = useRef();

  const clickEventHandler = (e) => {
    if (!selectRef.current.contains(e.target)) {
      setIsMenuVisible(false);
    }
  };

  useEventListener('click', clickEventHandler, document.getElementsByTagName('html')[0]);
  return (
    <div ref={selectRef} className={className}>
      <button
        className={`transition-all duration-200 border-2 border-solid border-green-500
        bg-white hover:bg-green-100 rounded-lg w-full h-full`}
        type="button"
        onClick={() => setIsMenuVisible(!isMenuVisible)}
        data-test="select-actions"
      >
        <ContainerComponent />
      </button>
      {isMenuVisible ? (
        <div className="border border-solid border-gray-400 bg-white absolute w-48 rounded-lg py-1 mt-2 shadow-md">
          {map(options, ({ label, onSelect }) => (
            <button
              type="button"
              onClick={() => {
                setIsMenuVisible(false);
                onSelect();
              }}
              className="relative pl-4 py-2 hover:bg-gray-200 w-full cursor-pointer text-left"
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

Select.propTypes = {
  ContainerComponent: PropTypes.node.isRequired,
  options: PropTypes.arrayOf(PropTypes.objectOf(['value', 'label', 'onSelect'])).isRequired,
  className: PropTypes.string,
};

Select.defaultProps = {
  className: '',
};

export default Select;
