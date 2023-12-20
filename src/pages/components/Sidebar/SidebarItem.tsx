import React from 'react';
import { Box, Flex, FlexProps } from '@chakra-ui/react';

interface IconType {
  size?: string | number | boolean;
}

interface SidebarItemProps extends FlexProps {
  icon: React.ReactElement<IconType>;
  href: string;
  children: React.ReactNode;
  activeBgColor?: string;
  activeTextColor?: string;
  _active?: {
    bg: string;
  };
  _hover?: {
    bg?: string;
    color?: string;
  };
  mb?: number;
}

const SidebarItem = ({
  icon,
  href,
  children,
  activeBgColor,
  activeTextColor,
  _active,
  _hover,
  mb,
}: SidebarItemProps) => (
  <Box as="a" href={href} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={
        _hover && {
          bg: 'cyan.400',
          color: 'white',
        }
      }
      _active={_active}
      bg={activeBgColor}
      color={activeTextColor}
      mb={mb}
    >
      {icon}
      {children}
    </Flex>
  </Box>
);

export default SidebarItem;
