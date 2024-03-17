import React from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../../../services/firebase';

const DashboardMenu = () => {
  const router = useRouter();
  const logOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.error('Unable to sign out', err);
    }
  };
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        borderColor="gray.200"
        borderWidth="2px"
        backgroundColor="white"
        _hover={{
          backgroundColor: 'gray.100',
        }}
        _active={{
          backgroundColor: 'gray.100',
        }}
      >
        Actions
      </MenuButton>
      <MenuList>
        <MenuItem onClick={logOut} icon={<FiLogOut />}>
          Log out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
export default DashboardMenu;
