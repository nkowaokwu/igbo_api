import React from 'react';
import { Box, Hide, SlideFade } from '@chakra-ui/react';
import DashboardMenu from './components/DashboardMenu';
import AuthManager from '../managers/AuthManager';
import DashboardSideMenu from './components/DashboardSideMenu';

const DashboardLayout = ({ children }: { children: any }) => (
  <Box className="flex flex-row overflow-y-hidden	overflow-x-hidden w-full">
    <Hide below="xl">
      <DashboardSideMenu />
    </Hide>
    <Box className="w-full">
      <Box
        className="w-full flex flex-row justify-end items-center p-4"
        backgroundColor="gray.50"
        height="14"
        borderBottomColor="gray.200"
        borderBottomWidth="1px"
      >
        <DashboardMenu />
      </Box>
      <AuthManager>
        <SlideFade in offsetX="-20px" offsetY="0px" className="w-full p-4">
          {children}
        </SlideFade>
      </AuthManager>
    </Box>
  </Box>
);

export default DashboardLayout;
