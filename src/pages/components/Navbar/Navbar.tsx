import React, { useState } from 'react';
import { Box, Button, Heading, Image, Link as ChakraLink } from '@chakra-ui/react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Link } from 'react-scroll';
import SubMenu from './SubMenu';

const menuIcon = (
  <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M14 5l-6.5 7L1 5" stroke="currentColor" stroke-linecap="square" />
  </svg>
);

const Navbar = ({ to = '/', isTransparent = false }: { to?: string; isTransparent?: boolean }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const matchesLargeScreenQuery = useMediaQuery('(min-width:1024px)');
  return (
    <Box
      className={`flex fixed items-center justify-between w-full py-5 lg:px-10
      ${isTransparent ? 'transparent' : 'bg-white bg-opacity-75'} select-none`}
      style={{ zIndex: 2 }}
    >
      <Heading
        as="h1"
        className="transition-element text-3xl font-extrabold hover:text-gray-700 text-gray-900 ml-5 lg:ml-0"
      >
        {to ? (
          <ChakraLink href={to}>
            <Image src="https://igbo-api.s3.us-east-2.amazonaws.com/images/igboAPI.svg" alt="Igbo API logo" />
          </ChakraLink>
        ) : (
          <Link className="cursor-pointer" to="homepage-container" smooth offset={-100} duration={600}>
            Igbo API
          </Link>
        )}
      </Heading>
      {!matchesLargeScreenQuery ? (
        <Button
          type="button"
          backgroundColor="transparent"
          _hover={{ backgroundColor: 'transparent' }}
          _active={{ backgroundColor: 'transparent' }}
          _focus={{ backgroundColor: 'transparent' }}
          className={`transition-element mr-5 lg:mr-0 ${isMenuVisible ? 'transform rotate-90' : ''}`}
          onClick={() => setIsMenuVisible(!isMenuVisible)}
        >
          {menuIcon}
        </Button>
      ) : null}
      <SubMenu
        isVisible={matchesLargeScreenQuery || isMenuVisible}
        isTransparent={isTransparent}
        onSelect={() => setIsMenuVisible(false)}
      />
    </Box>
  );
};

export default Navbar;
