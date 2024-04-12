import React from 'react';
import { Box, SlideFade } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import DashboardMenu from './components/DashboardMenu';
import AuthManager from '../managers/AuthManager';
import DashboardSideMenu from './components/DashboardSideMenu';
import { getDeveloper } from '../APIs/DevelopersAPI';
import { auth } from '../../services/firebase';
import { developerAtom } from '../atoms/dashboard';

const DashboardLayout = ({ children }: { children: any }) => {
  const [developer, setDeveloper] = useAtom(developerAtom);

  if (auth.currentUser && !developer) {
    getDeveloper(auth.currentUser.uid).then((fetchedDeveloper) => {
      setDeveloper(fetchedDeveloper);
    });
  }

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
            {developer ? children({ developer }) : null}
          </SlideFade>
        </AuthManager>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
