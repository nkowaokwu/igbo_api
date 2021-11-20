import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import FadeIn from 'react-fade-in';
import FadeReveal from 'react-reveal/Reveal';
import Navbar from './components/Navbar';
import Demo from './components/Demo';
import Card from './components/Card';
import Footer from './components/Footer';
import Statistics from './components/Statistics/Statistics';

const App = ({ searchWord, words }) => {
  const router = useRouter();
  return (
    <div className="overflow-x-hidden" id="homepage-container">
      <Navbar isHomepage />
      <div>
        <div className="flex flex-col justify-center w-screen md:h-screen p-0 pt-10 lg:pt-16">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl ml-16 font-extrabold md:mt-24">The First African</h1>
            <h1 className="text-4xl md:text-6xl sm:text-2xl   ml-20 font-extrabold">
              Language
              <span className="text-green-500">API</span>
            </h1>
          </FadeIn>
          <div className="text-xl md:text-xl w-9/12 md:w-7/12 ml-20 mb-4 mt-8 leading-10">
            <FadeIn>
              <p>
                {`Igbo is a rich Nigerian language that’s spoken by approximately 45 million people.
                Unfortunately, despite the language's wide use, it's considered to be a low resource language.
                
                The Igbo API aims to change this by making the process of learning Igbo more accessible 
                to the Nigerian diaspora and beyond.
                `}
              </p>
              <br />
              <div className="">
                <button
                  type="button"
                  className="mt-4 rounded-full bg-green-500  md:w-auto w-56 text-white border-2 py-2 md:px-4
                  mr-8 hover:bg-transparent
                  hover:text-black hover:border-green-500"
                  onClick={() => router.push('/signup')}
                >
                  Check on GitHub
                  <i className="fa fa-github text-3xl pl-3 text-black" />
                </button>
                <button
                  type="button"
                  className="mt-4 rounded-full w-56 border-green-500 border-2 bg-transparent
                  hover:bg-green-500 hover:text-white py-2 px-4"
                  onClick={() => router.push('/signup')}
                >
                  Get an API Key
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
        <div className="flex w-full justify-center md:justify-center md:w-3/12 my-12">
          <h2 id="features" className=" text-green-500 text-4xl">
            Features
          </h2>
        </div>
        <div className="text-xl  md:w-7/12 ml-20 mb-4 mt-8 leading-10">
          <p>
            {`Existing as an open-source project, the Igbo API aims to change this by making the 
                process of learning Igbo more accessible to the Nigerian diaspora and beyond.`}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col items-center lg:flex-row justify-evenly mt-10 mb-24 lg:space-x-10">
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
        <div className="flex w-full justify-center md:justify-center md:w-3/12">
          <h2 id="try-it-out" className="text-4xl text-green-500">
            Try it Out
          </h2>
        </div>
        <div className="text-xl md:text-1xl w-9/12 md:w-7/12 ml-20 mb-4 mt-8 leading-10 mb-48">
          <p>With each API key, you will get 2,500 requests per day.</p>
        </div>
        <Demo searchWord={searchWord} words={words} />
        <div className="flex w-full justify-center md:justify-center md:w-2/5">
          <h2 id="try-it-out" className="text-4xl text-green-500">
            Community Growth
          </h2>
        </div>
        <div className="text-xl md:text-1xl w-9/12  ml-20 mb-4 mt-8 leading-10">
          <p>
            Want t o see how this data is getting used? Take a look at the Nkọwa okwu, our official online Igbo
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
