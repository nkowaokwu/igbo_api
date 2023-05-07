import { Heading } from '@chakra-ui/react';
import React from 'react';
import Card from '../Card';

const UserInfo = () => (
  <Card
    title="User Information"
    description="This is your profile information"
    icon="👤"
    tooltipLabel="User Information"
  >
    <Heading as="h2">Profile</Heading>
  </Card>
);

export default UserInfo;
