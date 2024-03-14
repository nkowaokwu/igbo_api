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
import { useRouter } from 'next/router';
import { FiHome, FiUser, FiZap } from 'react-icons/fi';

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

const DashboardLayout = ({ children }: { children: any }) => {
  const router = useRouter();

  return (
    <Box className="flex flex-row overflow-y-hidden	overflow-x-hidden w-full">
      <Hide below="xl">
        <Box className="w-2/12 h-screen" backgroundColor="gray.50">
          <Box>
            <Heading
              as="h1"
              fontSize="lg"
              p="4"
              color="black"
              display="flex"
              alignItems="center"
              className="space-x-2"
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
                  backgroundColor={router.route === route ? 'gray.200' : 'transparent'}
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
      <SlideFade in offsetX="-20px" offsetY="0px" className="w-full lg:w-10/12 p-4">
        {' '}
        {children}
      </SlideFade>
    </Box>
  );
};

export default DashboardLayout;
