import React, { useEffect, useState } from 'react';
import { Box, Skeleton, SlideFade } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useAuthState } from 'react-firebase-hooks/auth';
import Error from './error';
import DashboardMenu from './components/DashboardMenu';
import AuthManager from '../managers/AuthManager';
import DashboardNavigationMenu from './components/DashboardNavigationMenu';
import { getDeveloper } from '../APIs/DevelopersAPI';
import { auth } from '../../services/firebase';
import { developerAtom } from '../atoms/dashboard';
import { DeveloperResponse } from '../../types';
import Plan from '../../shared/constants/Plan';
import AccountStatus from '../../shared/constants/AccountStatus';

export const DEFAULT_DEVELOPER = {
  id: '',
  name: 'developer',
  apiKey: 'apiKey',
  email: 'email',
  password: 'password',
  stripeId: 'stripeId',
  firebaseId: 'firebaseId',
  plan: Plan.STARTER,
  accountStatus: AccountStatus.UNPAID,
  usage: {
    data: new Date(),
    count: 0,
  },
};

const DashboardLayout = ({
  children,
}: {
  children: (arg: { developer: DeveloperResponse }) => JSX.Element,
}) => {
  const [user, isLoadingUser] = useAuthState(auth);
  const [isLoadingDeveloper, setIsLoadingDeveloper] = useState(false);
  const [developer, setDeveloper] = useAtom(developerAtom);

  useEffect(() => {
    if (user && !developer) {
      setIsLoadingDeveloper(true);
      getDeveloper(user.uid).then((fetchedDeveloper) => {
        setDeveloper(fetchedDeveloper);
        setIsLoadingDeveloper(false);
      });
    }
  }, [user, developer, setDeveloper]);

  return (
    <Box className="flex flex-row overflow-y-hidden	overflow-x-hidden w-full h-screen bg-gray-50">
      <Box className="w-full">
        <Box className="w-full p-2 bg-white" borderBottomColor="gray.200" borderBottomWidth="1px">
          <DashboardMenu />
          <DashboardNavigationMenu />
        </Box>
        <AuthManager>
          <SlideFade in offsetX="-20px" offsetY="0px" className="w-full h-full p-4">
            {isLoadingUser || isLoadingDeveloper ? (
              <Skeleton />
            ) : developer ? (
              children({ developer })
            ) : (
              <Error />
            )}
          </SlideFade>
        </AuthManager>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
