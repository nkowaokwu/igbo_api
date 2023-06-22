import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import { useRouter } from 'next/router';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import FadeReveal from 'react-reveal/Reveal';
import FadeIn from './components/FadeIn';
import Navbar from './components/Navbar';
import Demo from './components/Demo';
import Card from './components/Card';
import Footer from './components/Footer';
import Statistics from './components/Statistics';
import MentionedIn from './components/MentionedIn';
import GitHubStars from './components/GitHubStars';

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
    <div
      className="overflow-x-hidden flex flex-col items-center"
      id="homepage-container"
    >
      <Navbar />
      <div className="w-10/12 flex flex-col items-center">
        <div className="relative flex flex-col justify-center items-center w-full my-32 lg:w-6/12 space-y-12">
          <FadeIn>
            <h1
              style={{
                fontFamily: language !== 'en' ? 'inherit' : '',
                maxWidth: 500,
              }}
              className="text-center text-4xl md:text-6xl font-extrabold
              lg:mt-24 w-full"
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
            </h1>
          </FadeIn>
          <div className="text-xl md:text-xl w-full mb-4 mt-8 leading-10">
            <FadeIn>
              <p className="px-6 lg:px-0 text-center text-gray-500">
                {t('homepageDescription')}
              </p>
              <br />
              <div className="w-full flex flex-col lg:flex-row justify-center items-center lg:space-x-4">
                <GitHubStars stars={gitHubStats.stars} />
              </div>
            </FadeIn>
          </div>
        </div>
        <div className="w-full text-center lg:text-left my-6">
          <h2 id="features" className="text-4xl text-green-500 font-bold">
            {`🔌 ${t('Features')}`}
          </h2>
        </div>
        <div className="flex flex-col justify-between items-start w-full mb-4 mt-8">
          <p className="text-xl px-6 lg:px-0 text-gray-500">
            {t('featuresDescription')}
          </p>
          <div className="w-full flex flex-col items-center">
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12
              mt-10 mb-24 content-center place-items-center"
            >
              <FadeReveal>
                <Card
                  title={t('Definitions')}
                  description={t('Each word is provided with at least one definition.')}
                  icon="🗣"
                  tooltipLabel="All definitions are in English, while the head words are in Igbo."
                />
                <Card
                  title={t('Examples')}
                  description={t('Certain words are accompanied by contextual examples.')}
                  icon="✍🏾"
                  tooltipLabel="We are working to add at least on example Igbo sentence for each word entry."
                />
                <Card
                  title={t('Tone Marks')}
                  description={t('Diacritics are used to convey the different tones present in the Igbo language.')}
                  icon="📑"
                  tooltipLabel="We use the acute, grave, and macron diacritic marks to denote pronunciation."
                />
                <Card
                  title={t('Variations')}
                  description={t('The Igbo language has many dialects, some '
                  + 'words capture this nuance by providing variant spellings.')}
                  icon="🇳🇬"
                  tooltipLabel="The database is structured to make it easier for
                  contributors to add dialect-specific word data."
                />
                <Card
                  title={t('Nsịbịdị')}
                  description={t('Nsịbịdị is a writing system created in Nigeria.')}
                  icon="𑗉"
                  tooltipLabel="Each headword will be accompanied with its Nsịbịdị equivalent."
                />
                <Card
                  title={t('Proverbs')}
                  description={t('Proverbs are a core aspect of the Igbo language.')}
                  icon="🤲🏾"
                  tooltipLabel="Proverbs are associated with words that are used in those proverbs"
                />
              </FadeReveal>
            </div>
          </div>
        </div>
        <div className="w-full text-center lg:text-left my-6">
          <h2 id="try-it-out" className="text-4xl text-green-500 font-bold">
            {`🏃🏾‍♀️ ${t('Try it Out')}`}
          </h2>
        </div>
        <div className="text-xl md:text-1xl w-full mt-8 leading-10 mb-24">
          <p className="px-6 lg:px-0 text-center lg:text-left text-gray-500">
            {t('With each API key, you will get 2,500 requests per day.')}
          </p>
        </div>
        <Demo searchWord={searchWord} words={words} />
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
    </div>
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
