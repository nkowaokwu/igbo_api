import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Heading,
  Text,
} from '@chakra-ui/react';
// import { useRouter } from 'next/router';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import FadeIn from './components/FadeIn';
import Navbar from './components/Navbar';
import FeaturesSection from './components/FeaturesSection';
import DemoSection from './components/DemoSection';
import Footer from './components/Footer';
import Statistics from './components/Statistics';
import MentionedIn from './components/MentionedIn';
import GitHub from './components/Icons/GitHub';
import { GITHUB_REPO } from '../siteConstants';

const App = ({
  searchWord,
  words,
  databaseStats,
  gitHubStats,
}) => {
  const [language, setLanguage] = useState(i18n.language);
  // const router = useRouter();
  const { t } = useTranslation();
  useEffect(() => {
    /* Logic for rendering Nsịbịdị */
    // if (i18n?.language === 'ig') {
    //   document.body.classList.add('akagu');
    //   document.body.style.fontFamily = 'Akagu';
    // }
    setLanguage(i18n?.language);
  }, [i18n?.language]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box
      className="overflow-x-hidden flex flex-col items-center"
      backgroundColor="gray.900"
      id="homepage-container"
    >
      <Navbar />
      <div className="w-full flex flex-col items-center">
        <div className="relative flex flex-col justify-center items-center w-full my-32 space-y-12">
          <FadeIn>
            <Heading
              fontSize={{ base: '4xl', md: '7xl' }}
              fontWeight="600"
              color="white"
              textAlign="center"
              className="lg:mt-24 w-full"
            >
              {language === 'en' ? (
                <>
                  {t('The First African Language ')}
                  <span className="text-green-500">API</span>
                </>
              ) : (
                <>
                  <span className="text-green-500">API</span>
                  {t('The First African Language ')}
                </>
              )}
            </Heading>
          </FadeIn>
          <div className="text-xl md:text-xl w-full mb-4 mt-8 leading-10">
            <FadeIn>
              <Text className="px-6 lg:px-0 text-center text-white" fontFamily="Silka">
                {t('homepageDescription')}
              </Text>
              <br />
              <div className="w-full flex flex-col lg:flex-row justify-center items-center lg:space-x-8">
                <Button>Get API key</Button>
                <a href={GITHUB_REPO}>
                  <Button
                    leftIcon={<GitHub />}
                    backgroundColor="gray.900"
                    color="white"
                    borderColor="white"
                    boxShadow="white"
                  >
                    {`${gitHubStats.stars} Stars`}
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
        <DemoSection searchWord={searchWord} words={words} />
        <FeaturesSection />
        <div className="w-full text-center lg:text-left my-6">
          <h2 id="try-it-out" className="text-4xl text-green-500 font-bold">
            {`📣 ${t('Mentioned In')}`}
          </h2>
        </div>
        <MentionedIn />
        <div className="w-full text-center lg:text-left my-6">
          <h2 id="try-it-out" className="text-4xl text-green-500 font-bold">
            {`📈 ${t('Database Statistics')}`}
          </h2>
        </div>
        <div className="text-xl md:text-1xl w-full mb-4 mt-8 leading-10">
          <p className="px-6 lg:px-0 lg:pb-12 text-gray-500">
            {t('The Igbo API is the most robust, Igbo-English dictionary API that is maintained '
            + 'by our wonderful volunteer community.')}
          </p>
        </div>
        <Statistics {...databaseStats} {...gitHubStats} />
      </div>
      <Footer />
    </Box>
  );
};

App.propTypes = {
  searchWord: PropTypes.string,
  words: PropTypes.arrayOf(PropTypes.shape({})),
  databaseStats: PropTypes.shape({}),
  gitHubStats: PropTypes.shape({
    stars: PropTypes.number,
    contributors: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};

App.defaultProps = {
  searchWord: '',
  words: [],
  databaseStats: {},
  gitHubStats: {},
};

export default App;
