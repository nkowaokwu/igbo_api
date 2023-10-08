import React from 'react';
import { Box, CloseButton, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { AtSignIcon, ChatIcon, HamburgerIcon, StarIcon, WarningIcon } from '@chakra-ui/icons';
import SidebarItem from './SidebarItem';

const LinkItems = [
  { name: 'Profile', icon: <AtSignIcon /> },
  { name: 'Dashboard', icon: <ChatIcon /> },
  { name: 'API Documentation', icon: <StarIcon /> },
  { name: 'Contact Us', icon: <WarningIcon /> },
];

const SidebarContent = ({ onClose, ...rest }) => (
  <Box
    transition="3s ease"
    bg={useColorModeValue('white', 'gray.900')}
    borderRight="1px"
    borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    w={{ base: 'full', md: 60 }}
    pos="fixed"
    h="full"
    {...rest}
  >
    <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
      <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        IgboAPI
      </Text>
      <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
    </Flex>

    <SidebarItem
      icon={<HamburgerIcon />}
      _active={{ bg: 'gray.200' }}
      _hover={{ bg: 'gray.200' }}
      css={{
        '&:hover': {
          bg: 'inherit !important',
        },
      }}
      mb={5}
    >
      <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" paddingLeft={3} s>
        Menu
      </Text>
    </SidebarItem>

    {LinkItems.map((link) => (
      <SidebarItem key={link.name} icon={link.icon} _hover={{ bg: '#1570FA', color: 'white' }}>
        <Text fontSize="md" fontFamily="monospace" fontWeight="medium" paddingLeft={3}>
          {link.name}
        </Text>
      </SidebarItem>
    ))}
  </Box>
);

SidebarContent.propTypes = {
  onClose: PropTypes.func,
};

SidebarContent.defaultProps = {
  onClose: () => {},
};

export default SidebarContent;
