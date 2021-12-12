import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const About = () => (
  <div className="flex flex-col items-center h-screen">
    <Navbar to="/" isHomepage={false} />
    <div
      className="flex flex-col px-8 mb-6 lg:justify-between xl:flex-row pt-10
    lg:pt-32 max-w-2xl lg:max-w-6xl h-full text-gray-800 text-lg lg:text-xl w-full"
    >
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl">About</h1>
        <p className="mb-6">
          Igbo API is the first African Language API that focuses on making the Igbo language accessible to the world.
          One of our goals is to make a language resource that is so robust that it can be used to help solve a variety
          of complex problems from education to machine learning.
        </p>
        <p className="mb-6">
          {`The initial words and examples that populated this API came
          from Kay Williamson's Igbo Dictionary entitled `}
          <a className="link" href="http://www.columbia.edu/itc/mealac/pritchett/00fwp/igbo/IGBO%20Dictionary.pdf">
            {'Dictionary of Ònìchà Igbo. '}
          </a>
        </p>
        <p>
          {'This is a '}
          <a className="link" href="https://github.com/ijemmao/igbo_api">
            open-source passion project
          </a>
          {' by '}
          <a className="link" href="https://twitter.com/ijemmaohno">
            Ijemma Onwuzulike
          </a>
          .
        </p>
      </div>
      <div>
        <h1 className="text-3xl">Contact</h1>
        <p>
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
