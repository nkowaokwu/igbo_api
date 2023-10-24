import React from 'react';
import { Box, Text, useBreakpointValue } from '@chakra-ui/react';

const UserInfo: React.FC = function UserInfo() {
  const ml = useBreakpointValue({ base: 10, lg: 260 });

  return (
    <Box ml={ml} p="3">
      <Box display="flex">
        <Text fontSize="md" fontWeight="bold" fontFamily="monospace" marginTop={3}>
          Name:
        </Text>
        <Text fontSize="md" ml={3} fontWeight="medium" fontFamily="monospace" marginTop={3}>
          David Egorp
        </Text>
      </Box>
      <Box display="flex">
        <Text fontSize="md" fontWeight="bold" fontFamily="monospace" marginTop={3}>
          Email:
        </Text>
        <Text fontSize="md" ml={3} fontWeight="medium" fontFamily="monospace" marginTop={3}>
          davibfhsdjfgorp@gmail.com
        </Text>
      </Box>
      <Box display="flex">
        <Text fontSize="md" fontWeight="bold" fontFamily="monospace" marginTop={3}>
          Date joined:
        </Text>
        <Text fontSize="md" ml={3} fontWeight="medium" fontFamily="monospace" marginTop={3}>
          20 May, 2023
        </Text>
      </Box>
    </Box>
  );
};

export default UserInfo;
