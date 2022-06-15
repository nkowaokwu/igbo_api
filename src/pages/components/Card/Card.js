import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@chakra-ui/react';

const Card = ({
  title,
  description,
  icon,
  tooltipLabel,
}) => (
  <Tooltip label={tooltipLabel}>
    <div
      style={{
        maxHeight: 250,
        maxWidth: 400,
      }}
      className={`w-full flex flex-col items-center py-4 cursor-default
      shadow-md rounded-lg px-5 my-10 bg-gradient-to-t from-gray-50 to-white`}
    >
      <div className="flex flex-row justif-start items-center space-x-2">
        <span className="rounded-full text-3xl w-16 bg-white my-4 justify-center text-center">
          {icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p
            style={{
              maxHeight: 200,
              maxWidth: 400,
            }}
            className="text-l text-gray-500"
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  </Tooltip>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  tooltipLabel: PropTypes.string.isRequired,
};

export default Card;
