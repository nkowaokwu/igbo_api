import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, Text, chakra } from '@chakra-ui/react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import Navbar from './components/Navbar';
import Input from './components/Input';
import { PORT } from '../siteConstants';

const SignUp = () => {
  const [buttonText, setButtonText] = useState('Create account');
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [igboApiRoute, setIgboApiRoute] = useState('');
  const [apiKey, setApiKey] = useState('');
  const { handleSubmit, control, formState: { errors } } = useForm();

  useEffect(() => {
    const productionApiRoute = 'https://igboapi.com';
    const developmentApiRoute = `http://localhost:${PORT}`;
    let apiRoute = developmentApiRoute;
    if (typeof window !== 'undefined') {
      apiRoute =
        window.location.hostname === 'igboapi.com' && process.env.NODE_ENV === 'production'
          ? productionApiRoute
          : developmentApiRoute;
    } else {
      apiRoute = process.env.NODE_ENV === 'production' ? productionApiRoute : developmentApiRoute;
    }
    setIgboApiRoute(apiRoute);
  }, []);

  /* Changes the button text depending on the response */
  const handleCreateDeveloperResponse = (text: string) => {
    setButtonText(text);
    setIsButtonDisabled(true);
  };

  /* Sends a POST request to the Igbo API to create a new Developer */
  const createDeveloper = (data: { [key: string]: string | number }) =>
    axios({
      method: 'post',
      url: `${igboApiRoute}/api/v1/developers`,
      data,
    })
      .then(
        (res) => {
          if (res.status === 200) {
            handleCreateDeveloperResponse('Success! Check your email');
            setApiKey(res.data.apiKey);
          } else if (res.status >= 400) {
            handleCreateDeveloperResponse('An error occurred');
            setErrorMessage(res.data.error);
          }
        },
        (err) => {
          console.log(err);
          handleCreateDeveloperResponse('An error occurred');
          if (err.response.status >= 400) {
            setErrorMessage(err.response.data.error);
          }
        }
      )
      .catch((err) => {
        console.log(err);
        handleCreateDeveloperResponse('An error occurred');
      });

  /* Once the user submits the form, a new Developer account will be created */
  const onSubmit = createDeveloper;

  return (
    <Box className="flex flex-col items-center">
      <Navbar />
      <Box className="w-screen h-screen flex flex-row overflow-hidden">
        <Box className="flex flex-col w-0/12 lg:w-6/12 bg-gradient-to-tr from-blue-100 to-blue-500" />
        <Box className="flex flex-col justify-center items-center w-full lg:w-6/12">
          <Box className="w-10/12 lg:w-7/12">
            <Heading as="h1" className="text-5xl mb-6">
              Sign up.
            </Heading>
            <Text className="text-gray-600 font-normal mb-4">
              Provide some of your information so we can grant you access to the Igbo API.
            </Text>
          </Box>
          <form
            data-test="signup-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center items-center w-10/12 lg:w-7/12 h-8/12"
          >
            <Controller
              render={(props) => (
                <Input
                  {...props}
                  header="Your name"
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
            {errors.name ? <chakra.span className="error">Full name is required</chakra.span> : null}
            <Controller
              render={(props) => (
                <Input {...props} header="Your email" type="email" placeholder="Email" data-test="signup-email-input" />
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
            {errors.password ? <chakra.span className="error">Password is required</chakra.span> : null}
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
            {apiKey ? (
              <Box className="my-4 text-center space-y-6">
                <Heading as="h2" className="mb-4 text-gray-800 text-2xl">
                  Custom Igbo API Key:
                </Heading>
                <Box className="w-full space-x-2">
                  <code className="bg-gray-100 text-gray-600 p-1 w-full">{apiKey}</code>
                </Box>
                <Text className="text-red-600">
                  Please save this key in a secure location. This key will disappear once you leave this page
                </Text>
                <Text className="text-gray-600">
                  We&apos;ll also send you an email with your account information along with your API key.
                </Text>
              </Box>
            ) : null}
            {errorMessage ? (
              <Text className="text-red-600 mt-4" data-test="error-message">
                {errorMessage}
              </Text>
            ) : null}
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
