import React from 'react';
import { Box, Flex, FlexProps } from '@chakra-ui/react';

interface IconType {
  size?: string | number | boolean;
}

interface SidebarItemProps extends FlexProps {
  icon: React.ReactElement<IconType>;
  href: string;
  children: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = function SidebarItem({ icon, href, children }) {
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
      >
        {icon}
        {children}
      </Flex>
    </Box>
  );
};

export default SidebarItem;
