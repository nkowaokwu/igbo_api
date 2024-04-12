import React, { useState } from 'react';
import {
  Box,
  Divider,
  Heading,
  Text,
  ListItem,
  UnorderedList,
  chakra,
  Tooltip,
  Button,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiHome, FiUser, FiLock, FiZap, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const navigationOptions = [
  {
    label: 'Home',
    route: '/dashboard',
    icon: FiHome,
  },
  {
    label: 'Credentials',
    route: '/dashboard/credentials',
    icon: FiLock,
  },
  {
    label: 'Profile',
    route: '/dashboard/profile',
    icon: FiUser,
  },
];

const DashboardSideMenu = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <Box
      className={`h-screen flex flex-col justify-between transition-all ${isSideMenuOpen ? 'w-2/12' : ''}`}
      width={!isSideMenuOpen ? '60px' : ''}
      backgroundColor="gray.50"
    >
      <Box>
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
            <FiZap /> {isSideMenuOpen ? <chakra.span>IgboAPI</chakra.span> : null}
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
                className={`transition-all ${!isSideMenuOpen ? 'flex justify-center' : ''}`}
              >
                <Link href={route} className="flex items-center space-x-2 hover:text-black">
                  <Icon />
                  {isSideMenuOpen ? (
                    <Text
                      fontWeight="500"
                      fontSize="md"
                      letterSpacing="0"
                      color="gray.600"
                      _hover={{ color: 'black' }}
                    >
                      {label}
                    </Text>
                  ) : null}
                </Link>
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      </Box>
      <Box className="w-full flex flex-row justify-end items-center h-12 p-4">
        <Tooltip label={isSideMenuOpen ? 'Collapse' : 'Expand'}>
          <Button
            variant="ghost"
            _hover={{ backgroundColor: 'transparent' }}
            _active={{ backgroundColor: 'transparent' }}
            _focus={{ backgroundColor: 'transparent' }}
            onClick={toggleSideMenu}
            p={0}
          >
            {isSideMenuOpen ? <FiChevronLeft size="24px" /> : <FiChevronRight size="24px" />}
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default DashboardSideMenu;
