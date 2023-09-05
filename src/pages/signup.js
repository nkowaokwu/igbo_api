import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { useMediaQuery } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Input from './components/Input';
import { PORT } from '../siteConstants';

const SignUp = () => {
  const { t } = useTranslation('signup');
  const [buttonText, setButtonText] = useState('Create account');
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [igboApiRoute, setIgboApiRoute] = useState('');
  const [apiKey, setApiKey] = useState('');
  const { handleSubmit, control, errors } = useForm();

  const [matchesLargeScreenQuery] = useMediaQuery('(min-width:1024px)');

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
  const handleCreateDeveloperResponse = (text) => {
    setButtonText(text);
    setIsButtonDisabled(true);
  };

  /* Sends a POST request to the Igbo API to create a new Developer */
  const createDeveloper = (data) =>
    axios({
      method: 'post',
      url: `${igboApiRoute}/api/v1/developers`,
      data,
    })
      .then(
        (res) => {
          if (res.status === 200) {
            handleCreateDeveloperResponse(t('Success! Check your email'));
            setApiKey(res.data.apiKey);
          } else if (res.status >= 400) {
            handleCreateDeveloperResponse(t('An error occurred'));
            setErrorMessage(res.data.error);
          }
        },
        (err) => {
          console.log(err);
          handleCreateDeveloperResponse(t('An error occurred'));
          if (err.response.status >= 400) {
            setErrorMessage(err.response.data.error);
          }
        }
      )
      .catch((err) => {
        console.log(err);
        handleCreateDeveloperResponse(t('An error occurred'));
      });

  /* Once the user submits the form, a new Developer account will be created */
  const onSubmit = createDeveloper;

  return (
    <>
      <Navbar transparent={matchesLargeScreenQuery} />
      <div className="w-screen h-screen flex flex-row overflow-hidden">
        <div className="flex flex-col justify-center items-center w-full lg:w-6/12">
          <div className="w-10/12 lg:w-7/12">
            <h1 className="text-5xl mb-6">{t('Sign up.')}</h1>
            <h2 className="text-gray-600 font-normal mb-4">
              {t('Provide some of your information so we can grant you access to the Igbo API.')}
            </h2>
          </div>
          <form
            data-test="signup-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center items-center w-10/12 lg:w-7/12 h-8/12"
          >
            <Controller
              render={(props) => (
                <Input
                  {...props}
                  header={t('Your name')}
                  type="text"
                  placeholder={t('Full name')}
                  data-test="signup-name-input"
                />
              )}
              name="name"
              control={control}
              rules={{
                required: true,
              }}
            />
            {errors.name ? <span className="error">Full name is required</span> : null}
            <Controller
              render={(props) => (
                <Input
                  {...props}
                  header={t('Your email')}
                  type="email"
                  placeholder={t('Email')}
                  data-test="signup-email-input"
                />
              )}
              name="email"
              control={control}
              rules={{
                required: true,
              }}
            />
            {errors.email ? <span className="error">Email is required</span> : null}
            <Controller
              render={(props) => (
                <Input
                  {...props}
                  header={t('Password')}
                  type="password"
                  placeholder={t('Password')}
                  data-test="signup-password-input"
                />
              )}
              name="password"
              control={control}
              rules={{
                required: true,
              }}
            />
            {errors.password ? <span className="error">Password is required</span> : null}
            <button type="submit" className="primary-button" disabled={isButtonDisabled}>
              {t(buttonText)}
            </button>
            {apiKey ? (
              <div className="my-4 text-center space-y-6">
                <h2 className="mb-4 text-gray-800 text-2xl">{t('Custom Igbo API Key:')}</h2>
                <div className="w-full space-x-2">
                  <code className="bg-gray-100 text-gray-600 p-1 w-full">{apiKey}</code>
                </div>
                <p className="text-red-600">
                  {t('Please save this key in a secure location. This key will disappear once you leave this page')}
                </p>
                <p className="text-gray-600">
                  {t("We'll also send you an email with your account information along with your API key.")}
                </p>
              </div>
            ) : null}
            {errorMessage ? (
              <p className="text-red-600 mt-4" data-test="error-message">
                {errorMessage}
              </p>
            ) : null}
          </form>
        </div>
        <div className="flex flex-col w-0/12 lg:w-6/12 bg-gradient-to-tr from-green-100 to-green-500" />
      </div>
    </>
  );
};

export default SignUp;
