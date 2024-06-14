import React from 'react';
import {
  Box,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Link,
} from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../../../services/firebase';

const DashboardMenu = () => {
  const router = useRouter();
  const logOut = async () => {
    try {
      signOut(auth);
      router.push('');
    } catch (err) {
      console.error('Unable to sign out', err);
    }
  };
  return (
    <Box className="flex flex-row justify-between items-center px-2">
      <Link href="/">
        <Heading
          as="h1"
          m={0}
          p={0}
          fontSize="lg"
          height="fit"
          color="black"
          display="flex"
          alignItems="center"
          className="space-x-2"
        >
          IgboAPI
        </Heading>
      </Link>
      <Menu>
        <MenuButton
          as={Button}
          px={0}
          backgroundColor="transparent"
          _hover={{ backgroundColor: 'transparent' }}
          _active={{ backgroundColor: 'transparent' }}
          _focus={{ backgroundColor: 'transparent' }}
        >
          <Avatar bgGradient="linear(to-br, yellow.200, orange.500)" size="sm" icon={<> </>} />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={logOut} icon={<FiLogOut />}>
            Log out
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};
export default DashboardMenu;
