import React from 'react';
import {
  Avatar,
  Box,
  Flex,
  FlexProps,
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
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import Image from 'next/image';
import { BellIcon, ChevronDownIcon, HamburgerIcon, Search2Icon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { DEFAULT_AVATAR, LOGO_URL } from '../../../shared/constants/Developers';

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav: React.FC<MobileProps> = ({ onOpen }) => {
  const { t } = useTranslation('dashboard');
  const showLogo = useBreakpointValue({ base: false, md: false });
  const showIconBtn = useBreakpointValue({ base: 'flex', md: false });
  const showMd = useBreakpointValue({ base: 'none', md: 'flex' });

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
    >
      {showIconBtn ? (
        <IconButton onClick={onOpen} variant="outline" aria-label="open menu" icon={<HamburgerIcon />} />
      ) : null}

      {showLogo ? <Image src={LOGO_URL} width={100} height={100} alt="IgboAPI logo" /> : null}

      <InputGroup style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Input padding={6} background="gray.100" placeholder={t('Search...')} />
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
                <Avatar size="sm" src={DEFAULT_AVATAR} />
                {showMd ? (
                  <>
                    <VStack alignItems="flex-start" spacing="1px" ml="2">
                      <Text fontSize="sm">Egorp David</Text>
                    </VStack>
                    <Box>
                      <ChevronDownIcon boxSize="30px" />
                    </Box>
                  </>
                ) : null}
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem as="a" href="/profile" fontWeight="light">
                {t('Profile')}
              </MenuItem>
              <MenuItem as="a" href="/settings" fontWeight="light">
                {t('Settings')}
              </MenuItem>
              <MenuDivider />
              <MenuItem>{t('Sign out')}</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default MobileNav;
