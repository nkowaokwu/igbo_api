import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { useRouter } from 'next/router';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import FadeReveal from 'react-reveal/Reveal';
import FadeIn from './components/FadeIn';
import Navbar from './components/Navbar';
import Demo from './components/Demo';
import Card from './components/Card';
import Footer from './components/Footer';
import WorkersAroundHeart from './assets/workers-around-heart.svg';
import Statistics from './components/Statistics';
import MentionedIn from './components/MentionedIn';
import { GITHUB_REPO } from '../siteConstants';

const App = ({
  searchWord,
  words,
  databaseStats,
  gitHubStats,
}) => {
  const [language, setLanguage] = useState(i18n.language);
  const router = useRouter();
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
    <div className="overflow-x-hidden" id="homepage-container">
      <Navbar />
      <div>
        <div className="relative flex flex-col justify-center w-screen md:h-screen p-0 pt-10 lg:pt-16">
          <FadeIn>
            <h1
              style={{ fontFamily: language !== 'en' ? 'inherit' : '' }}
              className="text-center lg:text-left text-4xl md:text-6xl font-extrabold
              lg:ml-16 lg:mt-24 w-full lg:w-4/12"
            >
              {t('The First African Language API').split('$API$')[0]}
              <span className="text-green-500">API</span>
              {
                t('The First African Language API').split('$API$').length >= 2
                  ? t('The First African Language API').split('$API$')[1]
                  : ''
              }
            </h1>
          </FadeIn>
          <div className="text-xl md:text-xl w-full lg:w-7/12 lg:ml-16 mb-4 mt-8 leading-10">
            <FadeIn>
              <p className="px-6 lg:px-0">
                {t('homepageDescription')}
              </p>
              <br />
              <div className="w-full lg:w-1/2 flex flex-col lg:flex-row items-center lg:space-x-4">
                <button
                  type="button"
                  className="mt-4 rounded-full bg-green-500 lg:w-auto text-white border-2 py-2 md:px-4
                  hover:bg-transparent hover:text-black border-green-500 transition-all duration-200
                  flex flex-row justify-center items-center"
                  onClick={() => {
                    window.location = GITHUB_REPO;
                  }}
                  style={{ minWidth: '18rem' }}
                >
                  {t('Check on GitHub')}
                  <i className="fa fa-github text-3xl pl-3" />
                </button>
                <button
                  type="button"
                  className="mt-4 rounded-full border-green-500 border-2 bg-transparent
                  hover:bg-green-500 hover:text-white py-3 px-4 transition-all duration-200"
                  style={{ minWidth: '18rem' }}
                  onClick={() => router.push('/signup')}
                >
                  {t('Get an API Key')}
                </button>
              </div>
            </FadeIn>
          </div>
          <span className="workers-image absolute r-0 invisible xl:visible">
            <Image {...WorkersAroundHeart} />
          </span>
        </div>
        <div className="lg:w-7/12 lg:ml-20 w-full text-center lg:text-left my-6">
          <h2 id="features" className="text-4xl text-green-500 font-bold">
            {t('Features')}
          </h2>
        </div>
        <div className="text-xl w-full lg:w-7/12 lg:ml-20 mb-4 mt-8 leading-10">
          <p className="px-6 lg:px-0">
            {t('featuresDescription')}
          </p>
        </div>
        <div className="flex flex-col">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
            mt-10 mb-24 content-center place-items-center"
          >
            <FadeReveal>
              <Card
                title={t('Definitions')}
                description={t('Each word is provided with at least one definition.')}
                icon="fa fa-volume-up text-4xl mt-3 text-green-500"
              />
              <Card
                title={t('Examples')}
                description={t('Certain words are accompanied by contextual examples.')}
                icon="fa fa-list-alt text-4xl mt-3 text-green-500"
              />
              <Card
                title={t('Tone Marks')}
                description={t('Diacritics are used to convey the different tones present in the Igbo language.')}
                icon="fa fa-check text-4xl mt-3 text-green-500"
              />
              <Card
                title={t('Variations')}
                description={t('The Igbo language has many dialects, some '
                + 'words capture this nuance by providing variant spellings.')}
                icon="fa fa-window-restore text-4xl mt-3 text-green-500"
              />
            </FadeReveal>
          </div>
        </div>
        <div className="lg:w-7/12 lg:ml-20 w-full text-center lg:text-left my-6">
          <h2 id="try-it-out" className="text-4xl text-green-500 font-bold">
            {t('Try it Out')}
          </h2>
        </div>
        <div className="text-xl md:text-1xl w-full lg:w-7/12 lg:ml-20 mt-8 leading-10 mb-24">
          <p className="px-6 lg:px-0 text-center lg:text-left">
            {t('With each API key, you will get 2,500 requests per day.')}
          </p>
        </div>
        <Demo searchWord={searchWord} words={words} />
        <div className="lg:w-7/12 lg:ml-20 w-full text-center lg:text-left my-6">
          <h2 id="try-it-out" className="text-4xl text-green-500 font-bold">
            {t('Mentioned In')}
          </h2>
        </div>
        <MentionedIn />
        <div className="lg:w-7/12 lg:ml-20 w-full text-center lg:text-left my-6">
          <h2 id="try-it-out" className="text-4xl text-green-500 font-bold">
            {t('Database Statistics')}
          </h2>
        </div>
        <div className="text-xl md:text-1xl w-full lg:ml-20 mb-4 mt-8 leading-10">
          <p className="px-6 lg:px-0 lg:pb-12">
            {t('The Igbo API is the most robust, Igbo-English dictionary API that is maintained '
            + 'by our wonderful volunteer community.')}
          </p>
        </div>
        <Statistics {...databaseStats} {...gitHubStats} />
        <Footer />
      </div>
    </div>
  );
};

App.propTypes = {
  searchWord: PropTypes.string,
  words: PropTypes.arrayOf(PropTypes.shape({})),
  databaseStats: PropTypes.shape({}),
  gitHubStats: PropTypes.shape({}),
};

App.defaultProps = {
  searchWord: '',
  words: [],
  databaseStats: {},
  gitHubStats: {},
};

export default App;
