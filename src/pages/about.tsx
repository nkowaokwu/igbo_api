import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Link } from '@chakra-ui/react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { DICTIONARY_APP_URL } from '../siteConstants';

const About = () => {
  const { t } = useTranslation('about');
  const [language, setLanguage] = useState(i18n.language);
  useEffect(() => {
    /* Logic for rendering Nsịbịdị */
    // if (i18n?.language === 'ig') {
    //   document.body.classList.add('akagu');
    //   document.body.style.fontFamily = 'Akagu';
    // }
    setLanguage(i18n?.language);
  }, [i18n?.language]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box className="flex flex-col items-center h-screen">
      <Navbar to="/" />
      <Box
        className="flex flex-col px-8 mb-6 lg:justify-between xl:flex-row pt-10
      lg:pt-32 max-w-2xl lg:max-w-6xl text-gray-800 text-lg lg:text-xl w-full"
      >
        <Box className="max-w-3xl space-y-4 mb-10 text-gray-600">
          <Heading as="h1" className="text-3xl text-gray-700">
            {t('About')}
          </Heading>
          <Text className="mb-6">
            {t(
              'The Igbo API is a multidialectal, audio-supported, open-to-contribute, Igbo-English dictionary API. ' +
                'This project focuses on enabling developers, organizations, and teams to create technology ' +
                'that relies on the Igbo language.'
            )}
          </Text>
          <Text>
            {t(
              'Our main goal is to make an easy-to-access, robust, lexical Igbo language resource ' +
                'to help solve a variety of complex problems within the worlds of education to Machine Learning.'
            )}
          </Text>
          {language === 'en' ? (
            <Text>
              {'The Igbo API hosts and serves all word and example sentence data that is shown on '}
              <Link className="link" href={DICTIONARY_APP_URL}>
                Nkọwa okwu
              </Link>
              , our official online Igbo-English dictionary app.
            </Text>
          ) : (
            <Text
              dangerouslySetInnerHTML={{
                __html: t(
                  'The Igbo API hosts and serves all word and example sentence data ' +
                    'that is shown on Nkọwa okwu, our official online Igbo-English dictionary app.'
                ),
              }}
            />
          )}
          {language === 'en' ? (
            <Text>
              {`The initial words and examples that populated this API came
              from Kay Williamson's Igbo Dictionary entitled `}
              <Link
                className="link"
                href="http://www.columbia.edu/itc/mealac/pritchett/00fwp/igbo/IGBO%20Dictionary.pdf"
              >
                {'Dictionary of Ònìchà Igbo. '}
              </Link>
            </Text>
          ) : (
            <Text
              dangerouslySetInnerHTML={{
                __html: t(
                  'The initial words and examples that populated this API came ' +
                    "from Kay Williamson's Igbo Dictionary entitled Dictionary of Ònìchà Igbo."
                ),
              }}
            />
          )}
          {language === 'en' ? (
            <Text>
              {'This is an '}
              <Link className="link" href="https://github.com/nkowaokwu/igbo_api">
                open-source project
              </Link>
              {' created by '}
              <Link className="link" href="https://twitter.com/ijemmaohno">
                Ijemma Onwuzulike
              </Link>
              .
            </Text>
          ) : (
            <Text
              dangerouslySetInnerHTML={{
                __html: t('This is an open-source project created by Ijemma Onwuzulike.'),
              }}
            />
          )}
        </Box>
      </Box>
      <Box
        className="flex flex-col px-8 max-w-2xl lg:max-w-6xl
        mb-10 lg:mb-24 text-gray-800 text-lg lg:text-xl w-full"
      >
        <Heading as="h1" className="text-gray-700" fontSize="2xl">
          {t('Contact')}
        </Heading>
        <Text className="mt-6 text-gray-600">
          {t('Email')}
          {': '}
          <Link className="link" href="mailto:kedu@nkowaokwu.com">
            kedu@nkowaokwu.com
          </Link>
        </Text>
      </Box>
      <Footer />
    </Box>
  );
};

export default About;
