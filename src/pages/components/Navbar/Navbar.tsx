import React, { useState } from 'react';
import { Box, Button, Heading, Image, Link as ChakraLink } from '@chakra-ui/react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Link } from 'react-scroll';
import SubMenu from './SubMenu';
import TryItOut from '../TryItOut';

const menuIcon = (
  <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M14 5l-6.5 7L1 5" stroke="currentColor" strokeLinecap="square" />
  </svg>
);

const Navbar = ({ to = '/' }: { to?: string }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const matchesLargeScreenQuery = useMediaQuery('(min-width:1024px)');
  return (
    <Box
      className={`flex fixed items-center justify-between w-10/12 p-2 px-4 
      backdrop-blur-md select-none w-8/12`}
      style={{ zIndex: 2 }}
      borderColor="gray.300"
      borderWidth="1px"
      borderRadius="md"
      mt="4">
      <Heading
        as="h1"
        className="transition-element text-3xl font-extrabold hover:text-gray-700 text-gray-900"
        pb="0">
        {to ? (
          <ChakraLink href={to}>
            <Heading fontSize="2xl" pb="0">
              IgboAPI
            </Heading>
          </ChakraLink>
        ) : (
          <Link
            className="cursor-pointer"
            to="homepage-container"
            smooth
            offset={-100}
            duration={600}>
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
          className={`transition-element mr-5 lg:mr-0 ${
            isMenuVisible ? 'transform rotate-90' : ''
          }`}
          onClick={() => setIsMenuVisible(!isMenuVisible)}>
          {menuIcon}
        </Button>
      ) : null}
      <SubMenu
        isVisible={matchesLargeScreenQuery || isMenuVisible}
        onSelect={() => setIsMenuVisible(false)}
      />
      <TryItOut size="sm" borderRadius="full" />
    </Box>
  );
};

export default Navbar;
