import React from 'react';
import {
  Box,
  Divider,
  Heading,
  Text,
  Hide,
  ListItem,
  UnorderedList,
  SlideFade,
  chakra,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiHome, FiUser, FiZap } from 'react-icons/fi';
import DashboardMenu from './components/DashboardMenu';
import AuthManager from '../managers/AuthManager';

const navigationOptions = [
  {
    label: 'Home',
    route: '/dashboard',
    icon: FiHome,
  },
  {
    label: 'Profile',
    route: '/dashboard/profile',
    icon: FiUser,
  },
];

const DashboardLayout = ({ children }: { children: any }) => (
  <Box className="flex flex-row overflow-y-hidden	overflow-x-hidden w-full">
    <Hide below="xl">
      <Box className="w-2/12 h-screen" backgroundColor="gray.50">
        <Box>
          <Heading
            as="h1"
            fontSize="lg"
            height="14"
            color="black"
            display="flex"
            alignItems="center"
            className="space-x-2"
            p="0"
            pl="4"
          >
            <FiZap /> <chakra.span>IgboAPI</chakra.span>
          </Heading>
          <Divider borderColor="gray.300" />
        </Box>
        <Box p="2">
          <UnorderedList listStyleType="none" m={0} className="space-y-2">
            {navigationOptions.map(({ label, route, icon: Icon }) => (
              <ListItem
                key={label}
                p="2"
                borderRadius="md"
                _hover={{ cursor: 'pointer', color: 'black' }}
                // backgroundColor={router.route === route ? 'gray.200' : 'transparent'}
                className="transition-all"
              >
                <Link href={route} className="flex items-center space-x-2 hover:text-black">
                  <Icon />
                  <Text
                    fontWeight="500"
                    fontSize="md"
                    letterSpacing="0"
                    color="gray.600"
                    _hover={{ color: 'black' }}
                  >
                    {label}
                  </Text>
                </Link>
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      </Box>
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
