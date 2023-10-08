import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const SidebarItem = ({ icon, children, ...rest }) => (
  <Box as="a" href="#" style={{ textDecoration: 'none' }} focus={{ boxShadow: 'none' }}>
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: 'cyan.400',
        color: 'white',
      }}
      {...rest}
    >
      {icon && icon}
      {children}
    </Flex>
  </Box>
);

SidebarItem.propTypes = {
  icon: PropTypes.element,
  children: PropTypes.element,
};

SidebarItem.defaultProps = {
  icon: null,
  children: null,
};

export default SidebarItem;
