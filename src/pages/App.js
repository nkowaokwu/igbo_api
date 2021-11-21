import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import FadeIn from 'react-fade-in';
import FadeReveal from 'react-reveal/Reveal';
import Navbar from './components/Navbar';
import Demo from './components/Demo';
import Card from './components/Card';
import Footer from './components/Footer';
import WorkersAroundHeart from './assets/workers-around-heart.svg';
import Statistics from './components/Statistics/Statistics';
import { GITHUB_REPO, DICTIONARY_APP_URL } from '../siteConstants';

const App = ({ searchWord, words }) => {
  const router = useRouter();
  return (
    <div className="overflow-x-hidden" id="homepage-container">
      <Navbar isHomepage />
      <div>
        <div className="relative flex flex-col justify-center w-screen md:h-screen p-0 pt-10 lg:pt-16">
          <FadeIn>
            <h1
              className="text-center lg:text-left text-4xl md:text-6xl font-extrabold
              lg:ml-16 lg:mt-24 w-full lg:w-4/12"
            >
              {'The First African Language '}
              <span className="text-green-500">API</span>
            </h1>
          </FadeIn>
          <div className="text-xl md:text-xl w-full lg:w-7/12 lg:ml-16 mb-4 mt-8 leading-10">
            <FadeIn>
              <p className="px-6 lg:px-0">
                {`Igbo is a rich Nigerian language that’s spoken by approximately 45 million people.
                Unfortunately, despite the language's wide use, it's considered to be a low resource language.
                
                The Igbo API aims to change this by making the process of learning Igbo more accessible 
                to the Nigerian diaspora and beyond.
                `}
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
                  Check on GitHub
                  <i className="fa fa-github text-3xl pl-3" />
                </button>
                <button
                  type="button"
                  className="mt-4 rounded-full border-green-500 border-2 bg-transparent
                  hover:bg-green-500 hover:text-white py-2 px-4 transition-all duration-200"
                  style={{ minWidth: '18rem' }}
                  onClick={() => router.push('/signup')}
                >
                  Get an API Key
                </button>
              </div>
            </FadeIn>
          </div>
          <WorkersAroundHeart
            className="absolute r-0 invisible xl:visible"
            style={{
              position: 'absolute',
              right: '6rem',
              zIndex: -1,
            }}
          />
        </div>
        <div className="lg:w-7/12 lg:ml-20 w-full text-center lg:text-left my-6">
          <h2 id="features" className="text-green-500 text-4xl">
            Features
          </h2>
        </div>
        <div className="text-xl w-full lg:w-7/12 lg:ml-20 mb-4 mt-8 leading-10">
          <p className="px-6 lg:px-0">
            {`Existing as an open-source project, the Igbo API aims to change this by making the 
                process of learning Igbo more accessible to the Nigerian diaspora and beyond.`}
          </p>
        </div>
        <div className="flex flex-col">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
            mt-10 mb-24 content-center place-items-center"
          >
            <FadeReveal>
              <Card
                title="Definitions"
                description="Each word is provided with at least one definition."
                icon="fa fa-volume-up text-4xl mt-3 text-green-500"
              />
              <Card
                title="Examples"
                description="Certain words are accompanied by contextual examples."
                icon="fa fa-list-alt text-4xl mt-3 text-green-500"
              />
              <Card
                title="Tone Marks"
                description="Diacritics are used to convey the different tones present in the Igbo language."
                icon="fa fa-check text-4xl mt-3 text-green-500"
              />
              <Card
                title="Variations"
                description={`The Igbo language has many dialects, 
                some words capture this nuance by providing variant spellings.`}
                icon="fa fa-window-restore text-4xl mt-3 text-green-500"
              />
            </FadeReveal>
          </div>
        </div>
        <div className="lg:w-7/12 lg:ml-20 w-full text-center lg:text-left my-6">
          <h2 id="try-it-out" className="text-4xl text-green-500">
            Try it Out
          </h2>
        </div>
        <div className="text-xl md:text-1xl w-full lg:w-7/12 lg:ml-20 mb-4 mt-8 leading-10 mb-24">
          <p className="px-6 lg:px-0 text-center lg:text-left">
            With each API key, you will get 2,500 requests per day.
          </p>
        </div>
        <Demo searchWord={searchWord} words={words} />
        <div className="lg:w-7/12 lg:ml-20 w-full text-center lg:text-left my-6">
          <h2 id="try-it-out" className="text-4xl text-green-500">
            Community Growth
          </h2>
        </div>
        <div className="text-xl md:text-1xl w-full lg:ml-20 mb-4 mt-8 leading-10">
          <p className="px-6 lg:px-0">
            {'Want to see how this data is getting used? Take a look at the '}
            <a className="link" href={DICTIONARY_APP_URL}>
              Nkọwa okwu
            </a>
            , our official online Igbo
            dictionary.
          </p>
        </div>
        <Statistics />
        <Footer />
      </div>
    </div>
  );
};

App.propTypes = {
  searchWord: PropTypes.string,
  words: PropTypes.arrayOf(PropTypes.shape({})),
};

App.defaultProps = {
  searchWord: '',
  words: [],
};

export default App;
