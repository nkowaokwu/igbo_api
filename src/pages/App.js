import React from 'react';
import Navbar from './components/Navbar';
import Demo from './components/Demo';
import Card from './components/Card';
import { API_ROUTE, API_FROM_EMAIL } from '../siteConstants';

const App = () => (
  <div className="overflow-x-hidden" id="homepage-container">
    <Navbar />
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
      <Demo />
      <div className="flex w-full justify-center md:justify-center md:w-3/12 my-10">
        <h2 className="header">Docs</h2>
      </div>
      <div className="flex flex-col mb-12">
        <p className="text-2xl text-center text-gray-700 w-9/12 md:w-1/2 self-center mb-12">
          {'Are you a developer interested in using the API? Head over to the '}
          <a className="link" href={`${API_ROUTE}/docs`}>docs</a>
          {' to get started.'}
        </p>
        <p className="text-2xl text-center text-gray-700 w-9/12 md:w-1/2 self-center mb-24">
          {'If you would like to use this API for production purposes, request access by sending us an email at '}
          <a className="link" href={`mailto:${API_FROM_EMAIL}`}>{API_FROM_EMAIL}</a>
        </p>
      </div>
      <footer className={`flex flex-col text-center lg:text-left lg:flex-row
       justify-center items-center h-40 w-full bg-gray-900`}
      >
        <div className="text-gray-300 w-11/12 lg:w-9/12">
          <h1 className="text-3xl mb-2">Igbo API</h1>
          <p>
            {'Email: '}
            <a href={`mailto:${API_FROM_EMAIL}`}>{API_FROM_EMAIL}</a>
          </p>
        </div>
      </footer>
    </div>
  </div>
);

export default App;
