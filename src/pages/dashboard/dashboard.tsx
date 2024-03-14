import React from 'react';
import moment from 'moment';
import { Box, Heading, Stat, StatLabel, StatNumber, StatHelpText, Text } from '@chakra-ui/react';
import DashboardLayout from './layout';

const Dashboard = () => (
  <DashboardLayout>
    <Box mb={4}>
      <Heading as="h1">Home</Heading>
      <Text fontSize="sm" color="gray.700" letterSpacing="0">
        Your usage across all IgboAPI services.
      </Text>
    </Box>
    <Stat borderColor="gray.200" borderWidth="1px" borderRadius="md" p={4} maxWidth="400px">
      <Box className="flex flex-row justify-between items-center">
        <StatLabel>Daily IgboAPI Usage</StatLabel>
        <StatLabel>Daily limit: 500</StatLabel>
      </Box>
      <StatNumber>54</StatNumber>
      <StatHelpText>{moment().format('MMMM DD, YYYY')}</StatHelpText>
    </Stat>
  </DashboardLayout>
);

export default Dashboard;
