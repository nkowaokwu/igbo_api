/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import { AbsoluteCenter, Box, Button, Divider, Heading, Text, chakra } from '@chakra-ui/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import Login from './login';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { auth } from '../../services/firebase';
import { postDeveloper } from '../APIs/DevelopersAPI';

enum AuthState {
  SIGNING_IN,
  LOGGING_IN,
}

const SignUp = () => {
  const [buttonText, setButtonText] = useState('Create account');
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [authState, setAuthState] = useState(AuthState.SIGNING_IN);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  /* Changes the button text depending on the response */
  const handleCreateDeveloperResponse = (text: string) => {
    setButtonText(text);
    setIsButtonDisabled(true);
  };

  /* Sends a POST request to the Igbo API to create a new Developer */
  const createDeveloper = async (data: { [key: string]: string | number }) => {
    try {
      const res = await postDeveloper(data);
      if (res.status === 200) {
        router.push('/dashboard');
      } else if (res.status >= 400) {
        handleCreateDeveloperResponse('An error occurred');
        // @ts-expect-error unknown
        setErrorMessage(res.data?.error);
      }
    } catch (err) {
      handleCreateDeveloperResponse('An error occurred');
    }
  };

  /* Once the user submits the form, a new Developer account will be created */
  const onSubmit = async <T extends FieldValues>(data: T) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await createDeveloper({ ...data, firebaseId: userCredential.user.uid });
    } catch (err) {
      // Error
    }
  };

  const toggleAuthState = () => {
    setAuthState(authState !== AuthState.SIGNING_IN ? AuthState.SIGNING_IN : AuthState.LOGGING_IN);
  };

  return (
    <Box className="flex flex-col items-center">
      <Navbar />
      <Box className="w-screen h-screen flex flex-row overflow-hidden">
        <Box className="flex flex-col w-0/12 lg:w-6/12 bg-gradient-to-tr from-blue-100 to-blue-500" />
        <Box className="flex flex-col justify-center items-center w-full lg:w-6/12">
          <Box className="w-10/12 lg:w-8/12 xl:w-6/12 space-y-4">
            <Box className="w-full">
              <Heading as="h1" className="text-5xl">
                Sign up.
              </Heading>
              <Box mb="4">
                <Text className="text-gray-600">
                  Create an account to gain access to the Igbo API.
                </Text>
                <Box className="flex space-x-1">
                  <Text className="text-gray-600" color="gray.500" fontSize="sm">
                    {authState === AuthState.SIGNING_IN
                      ? 'Have an account?'
                      : "Don't have an account?"}
                  </Text>
                  <chakra.span
                    fontSize="sm"
                    color="blue.500"
                    _hover={{ color: 'blue.700', cursor: 'pointer' }}
                    onClick={toggleAuthState}
                  >
                    {authState === AuthState.SIGNING_IN ? 'Log in' : 'Sign in'}
                  </chakra.span>
                </Box>
              </Box>
            </Box>
            <form
              data-test="signup-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-center items-center h-8/12"
            >
              <Controller
                render={(props) => (
                  <Input
                    {...props}
                    header="Name"
                    type="text"
                    placeholder="Full name"
                    data-test="signup-name-input"
                  />
                )}
                name="name"
                control={control}
                rules={{
                  required: true,
                }}
              />
              {errors.name ? (
                <chakra.span className="error">Full name is required</chakra.span>
              ) : null}
              <Controller
                render={(props) => (
                  <Input
                    {...props}
                    header="Email"
                    type="email"
                    placeholder="Email"
                    data-test="signup-email-input"
                  />
                )}
                name="email"
                control={control}
                rules={{
                  required: true,
                }}
              />
              {errors.email ? <chakra.span className="error">Email is required</chakra.span> : null}
              <Controller
                render={(props) => (
                  <Input
                    {...props}
                    header="Password"
                    type="password"
                    placeholder="Password"
                    data-test="signup-password-input"
                  />
                )}
                name="password"
                control={control}
                rules={{
                  required: true,
                }}
              />
              {errors.password ? (
                <chakra.span className="error">Password is required</chakra.span>
              ) : null}
              <Button
                type="submit"
                className="primary-button"
                disabled={isButtonDisabled}
                backgroundColor="blue.500"
                _hover={{ backgroundColor: 'blue.400', color: 'white' }}
                color="white"
              >
                {buttonText}
              </Button>
              {errorMessage ? (
                <Text className="text-red-600 mt-4" data-test="error-message">
                  {errorMessage}
                </Text>
              ) : null}
            </form>
            <Box position="relative" py="4">
              <Divider />
              <AbsoluteCenter bg="white" px="4">
                or
              </AbsoluteCenter>
            </Box>
            <Box className="w-full">
              <Login />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
