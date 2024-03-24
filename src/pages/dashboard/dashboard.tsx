import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Box, Heading, Stat, StatLabel, StatNumber, StatHelpText, Text } from '@chakra-ui/react';
import DashboardLayout from './layout';
import { getDeveloper } from '../APIs/DevelopersAPI';
import { Developer } from '../../types';
import { auth } from '../../services/firebase';

const Dashboard = () => {
  const [developer, setDeveloper] = useState<Developer>();

  useEffect(() => {
    (async () => {
      if (auth.currentUser) {
        const fetchedDeveloper = await getDeveloper(auth.currentUser.uid);
        setDeveloper(fetchedDeveloper);
      }
    })();
  }, []);
  return (
    <DashboardLayout>
      <Box mb={4}>
        <Heading as="h1">Home</Heading>
        <Text fontSize="sm" color="gray.700" letterSpacing="0">
          Your usage across all IgboAPI services.
        </Text>
      </Box>
      <Stat borderColor="gray.200" borderWidth="1px" borderRadius="md" p={4} maxWidth="400px">
        <>
          <Box className="flex flex-row justify-between items-center">
            <StatLabel>Daily IgboAPI Usage</StatLabel>
            <StatLabel>Daily limit: 500</StatLabel>
          </Box>
          <StatNumber>54</StatNumber>
          <StatHelpText>{moment().format('MMMM DD, YYYY')}</StatHelpText>
          {console.log(developer)}
        </>
      </Stat>
    </DashboardLayout>
  );
};
export default Dashboard;
