import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const About = () => (
  <div className="flex flex-col items-center h-screen">
    <Navbar to="/" isHomepage={false} />
    <div className={`flex flex-col items-center lg:items-start lg:justify-center
    lg:flex-row pt-10 lg:pt-32 w-10/12 lg:w-8/12 h-full text-gray-800 lg:text-xl`}
    >
      <div className="w-full lg:w-8/12">
        <h1 className="text-3xl text-gray-800 lg:mt-0">About</h1>
        <p className="mb-6">
          Igbo API is the first African Language API that focuses on making the Igbo language accessible to the world.
          One of our goals is to make a language resource that is so robust that it can be used to help solve a variety
          of complex problems from education to machine learning.
        </p>
        <p className="mb-6">	
          {`The initial words and examples that populated this API came 	
          from Kay Williamson's Igbo Dictionary entitled `}	
          <a	
            className="link"	
            href="http://www.columbia.edu/itc/mealac/pritchett/00fwp/igbo/IGBO%20Dictionary.pdf"	
          >	
            {'Dictionary of Ònìchà Igbo. '}	
          </a>	
            All definitions come from contributions in the Igbo community.	
        </p>
        <p>
          {'This is a '}
          <a className="link" href="https://github.com/ijemmao/igbo_api">open-source passion project</a>
          {' by '}
          <a
            className="link"
            href="https://twitter.com/ijemmaohno"
          >
            Ijemma Onwuzulike
          </a>
          .
        </p>
      </div>
      <div className="w-full lg:w-3/12 mb-10 lg:mb-0">
        <h1 className="text-3xl text-gray-800 mt-10 lg:mt-0">Contact</h1>
        <p>
          {'Email: '}
          <a className="link" href="mailto:igboapi@gmail.com">igboapi@gmail.com</a>
        </p>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
