import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import Navbar from './components/Navbar';
import Input from './components/Input';
import { PORT } from '../siteConstants';

const Login = () => {
  const { t } = useTranslation('login');
  const [buttonText, setButtonText] = useState('Login');
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [igboApiRoute, setIgboApiRoute] = useState('');
  const { handleSubmit, control, errors, reset } = useForm();

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
  const handleLoginResponse = (text) => {
    setButtonText(text);
    setIsButtonDisabled(true);
  };

  /* Sends a POST request to the Igbo API to signin the Developer */
  const loginDeveloper = (data) => {
    if (!data) {
      setErrorMessage('An Error Occured');
      handleLoginResponse(t('An error occurred'));
    }
    handleLoginResponse(t('Login successful!'));
    console.log(`${{ data }}`);
    reset({
      email: '',
      password: '',
    });
  };

  /* Once the user submits the form, the Developer receives feedback on the details inputted */
  const onSubmit = loginDeveloper;

  return (
    <>
      <Navbar transparent />

      {/* To be deleted */}
      {igboApiRoute}

      <div className="w-screen h-screen flex flex-row overflow-hidden">
        <div className="flex flex-col justify-center items-center w-full lg:w-6/12">
          <div className="w-10/12 lg:w-7/12">
            <h1 className="text-5xl mb-6">{t('Log in.')}</h1>
            <h2 className="text-gray-600 font-normal mb-4">{t('Log in to your Igbo API dashboard.')}</h2>
          </div>
          <form
            data-test="login-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center items-center w-10/12 lg:w-7/12 h-8/12"
          >
            <Controller
              render={(props) => (
                <Input
                  {...props}
                  header={t('Your email')}
                  type="email"
                  placeholder={t('Email')}
                  data-test="login-email-input"
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
                  data-test="login-password-input"
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

export default Login;
