import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { DICTIONARY_APP_URL } from '../siteConstants';

const About = () => (
  <div className="flex flex-col items-center h-screen">
    <Navbar to="/" isHomepage={false} />
    <div
      className="flex flex-col px-8 mb-6 lg:justify-between xl:flex-row pt-10
    lg:pt-32 max-w-2xl lg:max-w-6xl h-full text-gray-800 text-lg lg:text-xl w-full"
    >
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl">About</h1>
        <div className="mt-6 space-y-6">
          <p>
            The Igbo API is a multidialectal, audio-supported, open-to-contribute, Igbo-English dictionary API.
            This project focuses on enabling developers, organizations, and teams to create technology that
            relies on the Igbo language.
          </p>
          <p>
            Our main goal is to make an easy-to-access, robust, lexical Igbo language resource
            to help solve a variety of complex problems within the worlds of education to Machine Learning.
          </p>
          <p>
            {'The Igbo API hosts and serves all word and example sentence data that is shown on '}
            <a className="link" href={DICTIONARY_APP_URL}>
              Nkọwa okwu
            </a>
            , our official online Igbo-English dictionary app.
          </p>
          <p>
            {`The initial words and examples that populated this API came
            from Kay Williamson's Igbo Dictionary entitled `}
            <a className="link" href="http://www.columbia.edu/itc/mealac/pritchett/00fwp/igbo/IGBO%20Dictionary.pdf">
              {'Dictionary of Ònìchà Igbo. '}
            </a>
          </p>
          <p>
            {'This is a '}
            <a className="link" href="https://github.com/ijemmao/igbo_api">
              open-source project
            </a>
            {' created by '}
            <a className="link" href="https://twitter.com/ijemmaohno">
              Ijemma Onwuzulike
            </a>
            .
          </p>
        </div>
      </div>
      <div>
        <h1 className="text-3xl">Contact</h1>
        <p className="mt-6">
          {'Email: '}
          <a className="link" href="mailto:kedu@nkowaokwu.com">
            kedu@nkowaokwu.com
          </a>
        </p>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
