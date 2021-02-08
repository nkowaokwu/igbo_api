import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import Navbar from './components/Navbar';
import Input from './components/Input';
import { PORT } from '../siteConstants';

const SignUp = () => {
  const [buttonText, setButtonText] = useState('Create account');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [igboApiRoute, setIgboApiRoute] = useState('');
  const {
    handleSubmit,
    control,
    errors,
  } = useForm();

  useEffect(() => {
    const productionApiRoute = 'https://igboapi.com';
    const developmentApiRoute = `http://localhost:${PORT}`;
    let apiRoute = developmentApiRoute;
    if (typeof window !== 'undefined') {
      apiRoute = window.location.hostname === 'igboapi.com' && process.env.NODE_ENV === 'production'
        ? productionApiRoute
        : developmentApiRoute;
    } else {
      apiRoute = process.env.NODE_ENV === 'production'
        ? productionApiRoute
        : developmentApiRoute;
    }
    setIgboApiRoute(apiRoute);
  }, []);

  /* Changes the button text depending on the response */
  const handleCreateDeveloperResponse = (text) => {
    setButtonText(text);
    setIsButtonDisabled(true);
  };

  /* Sends a POST request to the Igbo API to create a new Developer */
  const createDeveloper = (data) => (
    axios({
      method: 'post',
      url: `${igboApiRoute}/api/v1/developers`,
      data,
    }).then((res) => {
      if (res.status === 200) {
        handleCreateDeveloperResponse('Success! Check your email');
      } else if (res.status >= 400) {
        handleCreateDeveloperResponse('An error occurred');
      }
    }, (err) => {
      handleCreateDeveloperResponse(`An error occurred: ${err.message}`);
    })
  );

  /* Once the user submits the form, a new Developer account will be created */
  const onSubmit = createDeveloper;

  return (
    <>
      <Navbar transparent />
      <div className="w-screen h-screen flex flex-row overflow-hidden select-none">
        <div className="flex flex-col justify-center items-center w-full lg:w-6/12">
          <div className="w-10/12 lg:w-7/12">
            <h1 className="text-5xl mb-6">Sign up.</h1>
            <h2 className="text-gray-600 font-normal mb-4">
              Provide some of your information so we can grant you access to the Igbo API.
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
            {errors.name ? <span className="error">Full name is required</span> : null}
            <Controller
              render={(props) => (
                <Input
                  {...props}
                  header="Your email"
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
            {errors.email ? <span className="error">Email is required</span> : null}
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
            {errors.password ? <span className="error">Password is required</span> : null}
            <Controller
              render={(props) => (
                <Input
                  {...props}
                  header="Project Domain"
                  type="text"
                  placeholder="i.e. localhost or myapp.com"
                  data-test="signup-host-input"
                />
              )}
              name="host"
              control={control}
              rules={{
                required: true,
              }}
            />
            {errors.host ? <span className="error">Project domain is required</span> : null}
            <button
              type="submit"
              className="primary-button w-full mt-6"
              disabled={isButtonDisabled}
            >
              {buttonText}
            </button>
            <p className="text-gray-600 mt-6 w-11/12">
              {'We\'ll send you an email with your account information along with your API key.'}
            </p>
          </form>
        </div>
        <div className="flex flex-col w-0/12 lg:w-6/12 bg-gradient-to-r from-green-400 to-blue-500" />
      </div>
    </>
  );
};

export default SignUp;
