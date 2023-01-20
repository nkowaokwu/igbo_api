import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
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

const SubMenu = ({ isVisible, transparent }) => {
  const [language, setLanguage] = useState(i18n.language);
  const router = useRouter();
  const { t } = useTranslation();

  const navigate = (e, url) => {
    e.preventDefault();
    router.push(url);
  };

  const handleChangeLocale = (newLanguage) => {
    setLanguage(newLanguage);
  };

  useEffect(() => {
    changeLanguage(language);
  }, [language]);
  return (
    <ul
      className={`navbar ${transparent ? 'transparent-navbar' : ''} 
      ${isVisible ? 'visible opacity-1' : 'hidden opacity-0'}
      ${isVisible ? '' : 'pointer-events-none'}
      space-y-5 lg:space-y-0 lg:space-x-5 transition-all duration-100`}
    >
      <li className="transition-element">
        <button
          className="cursor-pointer font-normal"
          onClick={() => {
            router.push('/#features');
            window.scrollBy({ top: -100, behavior: 'smooth' });
          }}
          type="button"
        >
          {t('Features')}
        </button>
      </li>
      <li className="transition-element">
        <button
          className="cursor-pointer font-normal"
          onClick={(e) => navigate(e, '/about')}
          type="button"
        >
          {t('About')}
        </button>
      </li>
      <li className="transition-element">
        <a className="cursor-pointer font-normal" href="/docs">Docs</a>
      </li>
      <li className="transition-element">
        <button
          className="cursor-pointer font-normal"
          onClick={() => {
            router.push('/signup');
          }}
          role="link"
          type="button"
        >
          {t('Get an API Key')}
        </button>
      </li>
      <li className="flex justify-center items-center">
        <div className="bg-gray-200" style={{ height: '50%', width: 1 }} />
      </li>
      <li className="transition-element">
        <button
          className="cursor-pointer rounded-full bg-green-500 text-white border-2
          py-2 px-4 hover:bg-transparent hover:text-black border-green-500 transition-all duration-200"
          onClick={() => {
            router.push('/#try-it-out');
            window.scrollBy({ top: -100, behavior: 'smooth' });
          }}
          type="button"
        >
          {t('Try it Out')}
        </button>
      </li>
      <li className="transition-element">
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
          <MenuList color={transparent ? 'gray.500' : ''}>
            <MenuItem
              onClick={() => handleChangeLocale('en')}
              className="flex flex-row justify-between items-center"
            >
              <chakra.span>
                <chakra.span className="mr-3">🇺🇸</chakra.span>
                {' English'}
              </chakra.span>
              {language === 'en' ? <chakra.span><CheckIcon /></chakra.span> : null}
            </MenuItem>
            <MenuItem
              onClick={() => handleChangeLocale('ig')}
              className="flex flex-row justify-between items-center"
            >
              <chakra.span>
                <chakra.span className="mr-3">🇳🇬</chakra.span>
                {' Igbo'}
              </chakra.span>
              {language === 'ig' ? <chakra.span><CheckIcon /></chakra.span> : null}
            </MenuItem>
          </MenuList>
        </Menu>
      </li>
    </ul>
  );
};

SubMenu.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  transparent: PropTypes.bool,
};

SubMenu.defaultProps = {
  transparent: false,
};

export default SubMenu;
