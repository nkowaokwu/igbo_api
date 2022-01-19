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
import { Link } from 'react-scroll';

const SubMenu = ({ isVisible, isHomepage, transparent }) => {
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
    <nav
      className={`navbar ${transparent ? 'transparent-navbar' : ''} 
      ${isVisible ? 'visible opacity-1' : 'hidden opacity-0'}
      ${isVisible ? '' : 'pointer-events-none'}
      space-y-5 lg:space-y-0 lg:space-x-5 transition-all duration-100`}
    >
      {isHomepage ? (
        <>
          <li className="transition-element">
            <Link
              activeClass="nav-item-active"
              className="cursor-pointer"
              to="features"
              spy
              smooth
              offset={-100}
              duration={600}
            >
              {t('Features')}
            </Link>
          </li>
        </>
      ) : null}
      <li className="transition-element">
        <a
          href="/about"
          onClick={(e) => navigate(e, '/about')}
        >
          {t('About')}
        </a>
      </li>
      <li className="transition-element">
        <a href="/docs">Docs</a>
      </li>
      <li className="transition-element">
        <button
          onClick={() => {
            router.push('/signup');
          }}
          role="link"
          type="button"
        >
          {t('Get an API Key')}
        </button>
      </li>
      <li className="transition-element">
        <Link
          activeClass="nav-item-active"
          className="cursor-pointer rounded-full bg-green-500 text-white border-2
          py-2 px-4 hover:bg-transparent hover:text-black border-green-500 transition-all duration-200"
          to="try-it-out"
          spy
          smooth
          offset={-100}
          duration={600}
        >
          {t('Try it Out')}
        </Link>
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
              textTransform="uppercase"
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
              textTransform="uppercase"
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
    </nav>
  );
};

SubMenu.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isHomepage: PropTypes.bool,
  transparent: PropTypes.bool,
};

SubMenu.defaultProps = {
  isHomepage: false,
  transparent: false,
};

export default SubMenu;
