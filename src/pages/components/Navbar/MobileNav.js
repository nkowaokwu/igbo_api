import React from 'react';
import Proptypes from 'prop-types';
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, HamburgerIcon, Search2Icon } from '@chakra-ui/icons';

const MobileNav = ({ onOpen, ...rest }) => (
  <Flex
    ml={{ base: 0, md: 60 }}
    px={{ base: 4, md: 4 }}
    height="20"
    alignItems="center"
    bg={useColorModeValue('white', 'gray.900')}
    borderBottomWidth="1px"
    borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
    justifyContent={{ base: 'space-between', md: 'flex-end' }}
    {...rest}
  >
    <IconButton
      display={{ base: 'flex', md: 'none' }}
      onClick={onOpen}
      variant="outline"
      aria-label="open menu"
      icon={<HamburgerIcon />}
    />

    <Text display={{ base: 'flex', md: 'none' }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
      IgboAPI
    </Text>

    <InputGroup style={{ maxWidth: '500px', margin: '0 auto' }}>
      <Input padding={6} background="gray.100" placeholder="Search..." />
      <InputRightElement padding={6}>
        <Search2Icon />
      </InputRightElement>
    </InputGroup>

    <HStack spacing={{ base: '0', md: '6' }}>
      <BellIcon color="red.500" width={10} height={6} cursor="pointer" />

      <Flex alignItems="center">
        <Menu>
          <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
            <HStack>
              <Avatar
                size="sm"
                src="https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
              />
              <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                <Text fontSize="sm">Egorp David</Text>
              </VStack>
              <Box display={{ base: 'none', md: 'flex' }}>
                <ChevronDownIcon
                  __css={{
                    height: '30px',
                    width: '30px',
                  }}
                />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList bg={useColorModeValue('white', 'gray.900')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Billing</MenuItem>
            <MenuDivider />
            <MenuItem>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </HStack>
  </Flex>
);

MobileNav.propTypes = {
  onOpen: Proptypes.func,
};

MobileNav.defaultProps = {
  onOpen: () => {},
};

export default MobileNav;
