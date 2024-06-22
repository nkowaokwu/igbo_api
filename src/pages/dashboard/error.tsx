import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { FiAlertTriangle } from 'react-icons/fi';

const Error = () => (
  <Box className="w-full h-full flex flex-col justify-center items-center">
    <FiAlertTriangle size="200px" color="var(--chakra-colors-gray-400)" />
    <Text color="gray.400" fontSize="2xl" userSelect="none">
      An error occurred. Unable to load the page.
    </Text>
  </Box>
);

export default Error;
