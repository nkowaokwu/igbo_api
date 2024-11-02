import { Box, Heading, Text } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Login from './login';

const SignUp = () => (
  <>
    <Navbar to="/" />
    <Box className="w-full">
      <Box className="flex flex-col items-center">
        <Box className="w-screen h-screen flex flex-row overflow-hidden">
          <Box className="flex flex-col w-0/12 lg:w-6/12 bg-gradient-to-tr from-blue-100 to-blue-500" />
          <Box className="flex flex-col justify-center items-center w-full lg:w-6/12">
            <Box className="w-6/12 lg:w-8/12 xl:w-6/12 space-y-4">
              <Box className="w-full">
                <Heading as="h1" className="text-5xl" textAlign="center">
                  Sign in to the Igbo API
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  If you are a new user, continue to create an account. Existing users will be
                  logged in.
                </Text>
              </Box>
              <Login />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  </>
);

export default SignUp;
