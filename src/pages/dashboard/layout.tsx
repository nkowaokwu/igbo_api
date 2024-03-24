import React, { useEffect, useState } from 'react';
import { Box, SlideFade } from '@chakra-ui/react';
import DashboardMenu from './components/DashboardMenu';
import AuthManager from '../managers/AuthManager';
import DashboardSideMenu from './components/DashboardSideMenu';
import { getDeveloper } from '../APIs/DevelopersAPI';
import { Developer } from '../../types';
import { auth } from '../../services/firebase';

const DashboardLayout = ({ children }: { children: any }) => {
  const [developer, setDeveloper] = useState<Developer>();

  useEffect(() => {
    (async () => {
      if (auth.currentUser) {
        const fetchedDeveloper = await getDeveloper(auth.currentUser.uid);
        setDeveloper(fetchedDeveloper);
      }
    })();
  }, [developer]);

  return (
    <Box className="flex flex-row overflow-y-hidden	overflow-x-hidden w-full">
      <DashboardSideMenu />
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
            {developer ? children({ developer }) : developer}
          </SlideFade>
        </AuthManager>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
