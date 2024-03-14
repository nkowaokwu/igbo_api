import React from 'react';
import { Avatar, Box, Heading, Text, Badge } from '@chakra-ui/react';
import DashboardLayout from './layout';

const Profile = () => {
  const isStripeEnabled = false;
  return (
    <DashboardLayout>
      <Box className="flex flex-col justify-center items-center">
        <Avatar size="lg" />
        <Heading as="h1">Testing User</Heading>
        <Box className="space-y-2">
          <Box>
            <Text>testing@gmail.com</Text>
            <Text color="gray" fontSize="sm">
              davydocsurg@gmail.com
            </Text>
          </Box>
          <Badge colorScheme={isStripeEnabled ? 'blue' : 'yellow'}>
            {isStripeEnabled ? 'Stripe Connected' : 'Stripe Disconnected'}
          </Badge>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Profile;
