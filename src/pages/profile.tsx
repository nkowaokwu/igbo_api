import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, useColorModeValue } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import UserInfo from './components/UserInformation';

const Profile: React.FC = function Profile() {
  const { t } = useTranslation('dashboard');

  return (
    <Box minH="100vh" bg={useColorModeValue('white', 'white')}>
      <Sidebar />
      <DashboardHeader pageTitle={t('Profile')} />
      <UserInfo />
    </Box>
  );
};

export default Profile;
