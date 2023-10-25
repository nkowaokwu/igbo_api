import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Text, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';

const Dashboard: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const ml = useBreakpointValue({ base: 10, lg: 270 });

  return (
    <Box minH="100vh" bg={useColorModeValue('white', 'white')}>
      <Sidebar />
      <DashboardHeader pageTitle={t('Dashboard')} />
      <Box ml={ml} mt={70} p="3" maxW={250} background="gray.50" borderRadius={10} border="1px" borderColor="gray.900">
        <Box display="flex" p="2" background="gray.100" justifyContent="space-between">
          <Text fontSize="md" p="2" fontWeight="medium">
            {t('Calls')}
          </Text>

          <Text fontSize="2xl" fontWeight="bold">
            54
          </Text>
        </Box>
        <Text fontSize="md" fontFamily="monospace" marginTop={3}>
          {t('Total daily usage')}
        </Text>
      </Box>
    </Box>
  );
};

export default Dashboard;
