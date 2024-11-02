import { Avatar, Box, Heading, Text, VStack } from '@chakra-ui/react';
import DashboardLayout from './layout';

const Profile = () => (
  <DashboardLayout>
    {({ developer }) => (
      <VStack width="full" justifyContent="center" gap={2}>
        <Avatar size="lg" />
        <Heading as="h1">Profile</Heading>
        <Box className="space-y-2">
          <Box>
            <Text textAlign="center">{developer.name}</Text>
            <Text color="gray" fontSize="sm" textAlign="center">
              {developer.email}
            </Text>
          </Box>
          {/* <Box className="w-full flex justify-center">
            <Badge colorScheme={developer.stripeId ? 'blue' : 'yellow'}>
              {developer.stripeId ? 'Stripe Connected' : 'Stripe Disconnected'}
            </Badge>
          </Box> */}
        </Box>
      </VStack>
    )}
  </DashboardLayout>
);

export default Profile;
