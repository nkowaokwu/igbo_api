import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

interface IconType {
  size?: string | number | boolean;
}

interface SidebarItemProps {
  icon: React.ReactElement<IconType>;
  href: string;
  children: React.ReactNode;
  activeBgColor?: string;
  activeTextColor?: string;
}

const SidebarItem = ({ icon, href, children, activeBgColor, activeTextColor }: SidebarItemProps) => (
  <Box as="a" href={href} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
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
      bg={activeBgColor}
      color={activeTextColor}
    >
      {icon}
      {children}
    </Flex>
  </Box>
);

export default SidebarItem;
