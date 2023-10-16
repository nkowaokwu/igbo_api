import React from 'react';
import { Box, BoxProps, CloseButton, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { AtSignIcon, ChatIcon, HamburgerIcon, StarIcon, WarningIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import SidebarItem from './SidebarItem';
import { LOGO_URL } from '../../../shared/constants/Developers';

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent: React.FC<SidebarProps> = function SidebarContent({ onClose }) {
  const { t } = useTranslation('dashboard');

  const LinkItems = [
    { name: t('Profile'), href: '/profile', icon: <AtSignIcon /> },
    { name: t('Dashboard'), href: '/dashboard', icon: <ChatIcon /> },
    { name: t('API Documentation'), href: '/api-documentation', icon: <StarIcon /> },
    { name: t('Contact Us'), href: '/contact-us', icon: <WarningIcon /> },
  ];

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={LOGO_URL} width={100} height={100} alt="Igbo API logo" />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      <SidebarItem icon={<HamburgerIcon />} href="#" _active={{ bg: 'gray.200' }} _hover={{ bg: 'gray.200' }} mb={5}>
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" paddingLeft={3}>
          {t('Menu')}
        </Text>
      </SidebarItem>

      {LinkItems.map((link) => (
        <SidebarItem key={link.name} href={link.href} icon={link.icon} _hover={{ bg: 'blue.400', color: 'white' }}>
          <Text fontSize="md" fontFamily="monospace" fontWeight="medium" paddingLeft={3}>
            {link.name}
          </Text>
        </SidebarItem>
      ))}
    </Box>
  );
};

export default SidebarContent;
