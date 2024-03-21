import React from 'react';
import { Box, Heading, Link as ChakraLink, Show } from '@chakra-ui/react';
import { Link } from 'react-scroll';
import NavigationMenu from './NavigationMenu';
import NavigationOptions from './NavigationOptions';
import TryItOut from '../TryItOut';

const Navbar = ({ to = '/' }: { to?: string }) => (
  <Box className="fixed w-full flex justify-center items-center">
    <Box
      className={`flex items-center justify-between w-10/12 p-2 px-4 
      backdrop-blur-md select-none w-8/12`}
      style={{ zIndex: 2 }}
      borderColor="gray.300"
      borderWidth="1px"
      borderRadius="md"
      mt="4"
    >
      <Box className="flex flex-row items-center">
        <Heading
          as="h1"
          className="transition-element text-3xl font-extrabold hover:text-gray-700 text-gray-900"
          pb="0"
        >
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
              duration={600}
            >
              IgboAPI
            </Link>
          )}
        </Heading>
        <Show below="md">
          <NavigationMenu />
        </Show>
      </Box>
      <Show above="md">
        <NavigationOptions />
      </Show>
      <TryItOut size="sm" borderRadius="full" />
    </Box>
  </Box>
);

export default Navbar;
