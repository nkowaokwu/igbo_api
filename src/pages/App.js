import React from 'react';
import Navbar from './components/Navbar';
import Demo from './components/Demo';
import Card from './components/Card';
import { API_ROUTE } from './config';

const headerStyles = 'text-3xl font-bold text-gray-900 pl-64 my-10';

const App = () => (
  <div>
    <Navbar />
    <div>
      <div className="flex flex-col justify-center h-screen">
        <h1 className="text-6xl font-extrabold text-center mt-6 mb-24">The First African Language API</h1>
        <div className="text-2xl text-center text-gray-700 w-1/2 self-center mb-24">
          <p>
            {`Igbo is a rich Nigerian language that’s spoken by approximately 45 million people.
            Despite the language's wide use, it's considered to be a low resource language.`}
          </p>
          <br />
          <p>This API aims to change that</p>
        </div>
      </div>
      <h2 id="features" className={headerStyles}>
        Features
      </h2>
      <div className="flex flex-col mb-24">
        <div className="flex justify-evenly mt-10 mb-24">
          <Card title="Definitions" description="Each word is provided with at least one definition." />
          <Card title="Examples" description="Certain words are accompanied by contextual examples." />
          <Card
            title="Variations"
            description={`The Igbo language has many dialects, 
            some words capture this nuance by providing variant spellings.`}
          />
        </div>
        <p className="text-2xl text-center text-gray-700 w-1/2 self-center">
          As more words and examples get added to the API, the more information this API can expose.
        </p>
      </div>

      <h2 id="try-it-out" className={headerStyles}>
        Try it Out
      </h2>
      <Demo />
      <h2 className={headerStyles}>Docs</h2>
      <div className="flex flex-col mb-24">
        <p className="text-2xl text-center text-gray-700 w-1/2 self-center mb-24">
          {'Are you a developer interested in using the API? Head over to the '}
          <a className="text-green-400 hover:text-green-700" href={`${API_ROUTE}/docs`}>
            docs
          </a>
          {' to get started.'}
        </p>
      </div>
    </div>
  </div>
);

export default App;
