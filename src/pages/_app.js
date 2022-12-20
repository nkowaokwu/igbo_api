import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import en from '../public/locales/en';
import ig from '../public/locales/ig';
import * as gtag from '../lib/gtag';
import '../antd-extend.css';
import '../fonts.css';
import '../styles.css';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      ig,
    },
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',

    interpolation: {
      escapeValue: false,
    },
  });

const MainApp = ({ Component, pageProps, ...rest }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Igbo API - The First African Language API</title>
      </Head>
      <>
        <ChakraProvider>
          <Component {...pageProps} {...rest} />
        </ChakraProvider>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </>
    </>
  );
};

MainApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default appWithTranslation(MainApp);
