import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Text,
  Tooltip,
  chakra,
} from '@chakra-ui/react';

const Card = ({
  title,
  description,
  icon,
  tooltipLabel,
  color,
}) => (
  <Tooltip label={tooltipLabel}>
    <Box
      minHeight={52}
      backgroundColor={color}
      className="flex flex-col justify-between items-center p-4"
      borderWidth="2px"
      borderColor="gray.900"
      borderRadius="md"
      boxShadow="white"
    >
      <Box className="flex flex-row justify-start items-center space-x-2">
        <Box>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <Text
            style={{
            }}
            className="text-l"
            color="gray.700"
          >
            {description}
          </Text>
        </Box>
      </Box>
      <chakra.span fontSize="5xl" alignSelf="end">
        {icon}
      </chakra.span>
    </Box>
  </Tooltip>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  tooltipLabel: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default Card;
