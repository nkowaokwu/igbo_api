import React from 'react';
import { Box, Button, Heading, Link as ChakraLink, Show } from '@chakra-ui/react';
import { Link } from 'react-scroll';
import { useRouter } from 'next/router';
import NavigationMenu from './NavigationMenu';
import NavigationOptions from './NavigationOptions';

const Navbar = ({ to = '/' }: { to?: string }) => {
  const router = useRouter();
  return (
    <Box className="fixed w-full flex justify-center items-center" zIndex={1}>
      <Box
        className={`flex items-center justify-between w-10/12 p-2 px-4 
      backdrop-blur-md select-none`}
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
        <Button
          className="transition-all duration-200"
          backgroundColor="blue.500"
          _hover={{
            backgroundColor: 'blue.400',
          }}
          color="white"
          transitionDuration="200ms"
          size="sm"
          borderRadius="full"
          px="6"
          onClick={() => {
            router.push('/signup');
          }}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default Navbar;
