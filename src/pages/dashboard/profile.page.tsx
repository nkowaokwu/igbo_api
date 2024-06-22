import React from 'react';
import { Avatar, Box, Heading, Text, Badge } from '@chakra-ui/react';
import DashboardLayout from './layout';

const Profile = () => (
  <DashboardLayout>
    {({ developer }) => (
      <Box className="flex flex-col justify-center items-center">
        <Avatar size="lg" />
        <Heading as="h1">Profile</Heading>
        <Box className="space-y-2">
          <Box>
            <Text textAlign="center">{developer.name}</Text>
            <Text color="gray" fontSize="sm" textAlign="center">
              {developer.email}
            </Text>
          </Box>
          <Box className="w-full flex justify-center">
            <Badge colorScheme={developer.stripeId ? 'blue' : 'yellow'}>
              {developer.stripeId ? 'Stripe Connected' : 'Stripe Disconnected'}
            </Badge>
          </Box>
        </Box>
      </Box>
    )}
  </DashboardLayout>
);

export default Profile;
