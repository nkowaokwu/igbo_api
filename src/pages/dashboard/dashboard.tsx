import React from 'react';
import {
  Box,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import DashboardLayout from './layout';

const Dashboard = () => (
  <DashboardLayout>
    {({ developer }) => (
      <Skeleton isLoaded={Boolean(developer)}>
        <Box mb={4}>
          <Heading as="h1">Home</Heading>
          <Text fontSize="sm" color="gray.700" letterSpacing="0">
            Your usage across all IgboAPI services.
          </Text>
        </Box>
        <Stat
          borderColor="gray.200"
          borderWidth="1px"
          borderRadius="md"
          p={4}
          maxWidth="400px"
          backgroundColor="white"
        >
          <>
            <Box className="flex flex-row justify-between items-center">
              <StatLabel>Daily IgboAPI Usage</StatLabel>
              <StatLabel>Daily limit: 500</StatLabel>
            </Box>
            <StatNumber>{developer?.usage.count}</StatNumber>
            <StatHelpText>
              Last date used: {moment(developer?.usage.date).format('MMMM DD, YYYY')}
            </StatHelpText>
          </>
        </Stat>
      </Skeleton>
    )}
  </DashboardLayout>
);
export default Dashboard;
