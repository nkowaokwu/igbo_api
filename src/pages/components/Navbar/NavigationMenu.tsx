import React from 'react';
import Link from 'next/link';
import { Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { navigationLinks } from '../../../shared/constants/navigationLinks';

const NavigationMenu = () => (
  <Menu>
    <MenuButton
      as={IconButton}
      icon={<FiChevronDown />}
      variant="ghost"
      _hover={{ backgroundColor: 'transparent' }}
      _focus={{ backgroundColor: 'transparent' }}
      _active={{ backgroundColor: 'transparent' }}
      data-test="drop-down-button"
    />
    <MenuList>
      {navigationLinks.map(({ href, label }) => (
        <MenuItem key={label}>
          <Link href={href}>{label}</Link>
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
);

export default NavigationMenu;
