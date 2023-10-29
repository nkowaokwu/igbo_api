import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  UnorderedList,
  ListItem,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  chakra,
} from '@chakra-ui/react';
import { CheckIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import i18n, { changeLanguage } from 'i18next';
import { useRouter } from 'next/router';

const SubMenu = ({ isVisible, isTransparent = false }: { isVisible: boolean; isTransparent?: boolean }) => {
  const [language, setLanguage] = useState(i18n.language);
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleChangeLocale = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  useEffect(() => {
    changeLanguage(language);
  }, [language]);
  return (
    <UnorderedList
      className={`navbar ${isTransparent ? 'transparent-navbar' : ''}
      ${isVisible ? 'visible opacity-1' : 'hidden opacity-0'}
      ${isVisible ? '' : 'pointer-events-none'}
      space-y-5 lg:space-y-0 lg:space-x-5 transition-all duration-100`}
      data-test="sub-menu"
    >
      <ListItem className="transition-element">
        <Link className="font-normal cursor-pointer" href="#features">
          {t('Features')}
        </Link>
      </ListItem>
      <ListItem className="transition-element">
        <Link className="font-normal cursor-pointer" href="/about" type="button">
          {t('About')}
        </Link>
      </ListItem>
      <ListItem className="transition-element">
        <Link className="font-normal cursor-pointer" href="/docs">
          Docs
        </Link>
      </ListItem>
      <ListItem className="transition-element">
        <Link className="font-normal cursor-pointer" href="/signup" role="link" type="button">
          {t('Get an API Key')}
        </Link>
      </ListItem>
      <ListItem className="flex items-center justify-center">
        <Box className="bg-gray-200" style={{ height: '50%', width: 1 }} />
      </ListItem>
      <ListItem className="transition-element">
        <Button
          className="px-4 py-2 transition-all duration-200 bg-green-500 rounded-full cursor-pointer hover:bg-transparent"
          onClick={() => {
            router.push('/#try-it-out');
            window.scrollBy({ top: -100, behavior: 'smooth' });
          }}
          colorScheme="green"
          type="button"
        >
          {t('Try it Out')}
        </Button>
      </ListItem>
      <ListItem className="transition-element">
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            backgroundColor="transparent"
            fontSize="2xl"
            px={0}
            _hover={{
              backgroundColor: 'transparent',
            }}
            _active={{
              backgroundColor: 'transparent',
            }}
          >
            {language === 'en' ? '🇺🇸' : '🇳🇬'}
          </MenuButton>
          <MenuList color={isTransparent ? 'gray.500' : ''}>
            <MenuItem onClick={() => handleChangeLocale('en')} className="flex flex-row items-center justify-between">
              <chakra.span>
                <chakra.span className="mr-3">🇺🇸</chakra.span>
                {' English'}
              </chakra.span>
              {language === 'en' ? (
                <chakra.span>
                  <CheckIcon />
                </chakra.span>
              ) : null}
            </MenuItem>
            <MenuItem onClick={() => handleChangeLocale('ig')} className="flex flex-row items-center justify-between">
              <chakra.span>
                <chakra.span className="mr-3">🇳🇬</chakra.span>
                {' Igbo'}
              </chakra.span>
              {language === 'ig' ? (
                <chakra.span>
                  <CheckIcon />
                </chakra.span>
              ) : null}
            </MenuItem>
          </MenuList>
        </Menu>
      </ListItem>
    </UnorderedList>
  );
};

export default SubMenu;
