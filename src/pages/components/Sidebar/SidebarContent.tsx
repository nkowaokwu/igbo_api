import React, { useEffect } from 'react';
import { Box, BoxProps, CloseButton, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { AtSignIcon, ChatIcon, HamburgerIcon, StarIcon, WarningIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SidebarItem from './SidebarItem';
import { LOGO_URL } from '../../../shared/constants/Developers';

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent: React.FC<SidebarProps> = function SidebarContent({ onClose }) {
  const { t } = useTranslation('dashboard');
  const router = useRouter();
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
        <Link key={link.name} href={link.href} passHref>
          <SidebarItem
            href={link.href}
            icon={link.icon}
            _hover={{ bg: 'blue.400', color: 'white' }}
            color={router.pathname === link.href ? 'white' : 'gray.800'}
            activeBgColor={router.pathname === link.href ? 'blue.600' : 'transparent'}
            activeTextColor={router.pathname === link.href ? 'white' : 'gray.800'}
          >
            <Text fontSize="md" fontFamily="monospace" fontWeight="medium" paddingLeft={3}>
              {link.name}
            </Text>
          </SidebarItem>
        </Link>
      ))}
    </Box>
  );
};

export default SidebarContent;
