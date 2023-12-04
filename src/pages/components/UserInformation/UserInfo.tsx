import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const UserInfo = () => {
  const { t } = useTranslation('dashboard');

  return (
    <Box ml={{ base: 10, lg: 260 }} p="3">
      <Box display="flex">
        <Text fontSize="md" fontWeight="bold" fontFamily="monospace" marginTop={3}>
          {t('Name')}:
        </Text>
        <Text fontSize="md" ml={3} fontWeight="medium" fontFamily="monospace" marginTop={3}>
          David Egorp
        </Text>
      </Box>
      <Box display="flex">
        <Text fontSize="md" fontWeight="bold" fontFamily="monospace" marginTop={3}>
          {t('Email')}:
        </Text>
        <Text fontSize="md" ml={3} fontWeight="medium" fontFamily="monospace" marginTop={3}>
          davibfhsdjfgorp@gmail.com
        </Text>
      </Box>
      <Box display="flex">
        <Text fontSize="md" fontWeight="bold" fontFamily="monospace" marginTop={3}>
          {t('Date Joined')}:
        </Text>
        <Text fontSize="md" ml={3} fontWeight="medium" fontFamily="monospace" marginTop={3}>
          20 May, 2023
        </Text>
      </Box>
    </Box>
  );
};

export default UserInfo;
