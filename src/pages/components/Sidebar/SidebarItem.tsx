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
}

const SidebarItem: React.FC<SidebarItemProps> = function SidebarItem({
  icon,
  href,
  children,
  activeBgColor,
  activeTextColor,
}) {
  return (
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
};

SidebarItem.defaultProps = {
  activeBgColor: 'transparent',
  activeTextColor: 'gray.800',
};

export default SidebarItem;
