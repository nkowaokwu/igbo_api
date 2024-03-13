import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';

const UserInfo = () => (
  <Box className="w-full lg:text-left mt-6">
    <Heading as="h4">User Information</Heading>
    <Text>Name: David Ndubuisi </Text>
    <Text>Email: davydocsurg@gmail.com</Text>
    <Text>Total Daily Usage: 54</Text>
  </Box>
);

export default UserInfo;
