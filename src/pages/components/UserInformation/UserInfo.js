import { Heading } from '@chakra-ui/react';
import React from 'react';

const UserInfo = () => (
  <div className="w-full lg:text-left mt-6">
    <Heading as="h4">User Information</Heading>
    <p>Name: David Ndubuisi </p>
    <p>Email: davydocsurg@gmail.com</p>
    <p>Total Daily Usage: 54</p>
  </div>
);

export default UserInfo;
