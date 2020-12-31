import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Navbar from './components/Navbar';
import Demo from './components/Demo';
import Card from './components/Card';
import Footer from './components/Footer';
import { API_FROM_EMAIL } from '../siteConstants';

const App = ({ searchWord, words }) => {
  const router = useRouter();
  return (
    <div className="overflow-x-hidden" id="homepage-container">
      <Navbar isHomepage />
      <div>
        <div className="flex flex-col justify-center w-screen h-screen p-0 lg:pt-32">
          <h1 className="text-4xl md:text-6xl font-extrabold text-center mt-6 mb-24">The First African Language API</h1>
          <div className="text-xl md:text-2xl text-center text-gray-700 w-9/12 md:w-7/12 self-center mb-24">
            <p>
              {`Igbo is a rich Nigerian language that’s spoken by approximately 45 million people.
              Unfortunately, despite the language's wide use, it's considered to be a low resource language.`}
            </p>
            <br />
            <p>
              {'Existing as an '}
              <a
                className="link"
                href="https://github.com/ijemmao/igbo_api"
              >
                open-source project
              </a>
              , the Igbo API aims to change this by making the process of learning Igbo more accessible to the Nigerian
              diaspora and beyond.
            </p>
            {process.env.NODE_ENV !== 'production' ? (
              <button
                type="button"
                className="primary-button w-64 mt-12"
                onClick={() => router.push('/signup')}
              >
                Register for an API Key
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex w-full justify-center md:justify-center md:w-3/12 my-10">
          <h2 id="features" className="header">
            Features
          </h2>
        </div>
        <div className="flex flex-col mb-24">
          <div className="flex flex-col items-center lg:flex-row justify-evenly mt-10 mb-24 lg:space-x-10">
            <Card title="Definitions" description="Each word is provided with at least one definition." />
            <Card title="Examples" description="Certain words are accompanied by contextual examples." />
            <Card
              title="Tone Marks"
              description="Diacritics are used to convey the different tones present in the Igbo language."
            />
            <Card
              title="Variations"
              description={`The Igbo language has many dialects, 
              some words capture this nuance by providing variant spellings.`}
            />
          </div>
          <p className="text-2xl text-center text-gray-700 w-9/12 md:w-1/2 self-center">
            As more words and examples get added to the API, the more information this API can expose.
          </p>
        </div>
        <div className="flex w-full justify-center md:justify-center md:w-3/12 my-10">
          <h2 id="try-it-out" className="header">
            Try it Out
          </h2>
        </div>
        <Demo searchWord={searchWord} words={words} />
        <div className="flex w-full justify-center md:justify-center md:w-3/12 my-10">
          <h2 className="header">Use in Production</h2>
        </div>
        <div className="flex flex-col mb-12">
          <p className="text-2xl text-center text-gray-700 w-9/12 md:w-1/2 self-center mb-24">
            {'If you would like to use this API for production purposes, request access by sending us an email at '}
            <a className="link" href={`mailto:${API_FROM_EMAIL}`}>{API_FROM_EMAIL}</a>
          </p>
        </div>
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
