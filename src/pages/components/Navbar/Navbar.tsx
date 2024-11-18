import { Box, Button, Link as ChakraLink, Heading, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Link } from 'react-scroll';
import NavigationMenu from './NavigationMenu';
import NavigationOptions from './NavigationOptions';

const Navbar = ({ to = '/' }: { to?: string }) => {
  const router = useRouter();
  return (
    <Box
      className="fixed w-full flex justify-center items-center"
      backgroundColor="white"
      zIndex={1}
      p={4}
    >
      <Box className="flex items-center justify-between w-11/12" style={{ zIndex: 2 }}>
        <Box className="flex flex-row items-center" flex={1}>
          <Heading
            as="h1"
            className="transition-element text-3xl font-extrabold hover:text-gray-700 text-gray-900"
            pb="0"
            color="black"
            fontSize={{ base: '2xl', md: '3xl' }}
          >
            {to ? (
              <ChakraLink
                href={to}
                color="black"
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
                _active={{ textDecoration: 'none' }}
                _focus={{ textDecoration: 'none' }}
              >
                Igbo API
              </ChakraLink>
            ) : (
              <Link
                className="cursor-pointer"
                to="homepage-container"
                smooth
                offset={-100}
                duration={600}
              >
                Igbo API
              </Link>
            )}
          </Heading>
          <Show below="md">
            <NavigationMenu />
          </Show>
        </Box>
        <Show above="md">
          <Box flex={4}>
            <NavigationOptions />
          </Box>
        </Show>
        <Box display="flex" flexDirection="row" className="space-x-3" flex={1}>
          <Button
            className="transition-all duration-200"
            backgroundColor="white"
            _hover={{
              backgroundColor: 'white',
            }}
            color="blue.500"
            transitionDuration="200ms"
            size="sm"
            borderRadius="full"
            borderWidth="1px"
            borderColor="blue.500"
            px="6"
            onClick={() => {
              router.push('/signup');
            }}
          >
            Log In
          </Button>
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
            Get Started
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
