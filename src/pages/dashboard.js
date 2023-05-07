import { Heading } from '@chakra-ui/react';
import React from 'react';
import UserInfo from './components/UserInformation';

const Dashboard = () => (
  <div
    className="flex flex-col items-center h-screen"
    // style={{
    //   display: 'flex',
    //   flexDirection: 'column',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   height: '100vh',
    // }}
  >
    <Heading as="h1">Dashboard</Heading>
    <UserInfo />
  </div>
);

export default Dashboard;
