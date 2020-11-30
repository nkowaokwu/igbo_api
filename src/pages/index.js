import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import WelcomeCarousel from '../components/WelcomeCarousel';
import { FROM_EMAIL } from '../config';

const Home = () => (
  <div className="page-container">
    <Navbar />
    <SearchBar />
    <div className="flex flex-col self-center w-10/12 lg:w-6/12 mt-5 lg:mt-8 space-y-4 text-gray-600">
      <p>
        Nkowa ọkwu is an online Igbo-English dictionary. It for searching Igbo words using either Igbo or English.
      </p>
      <p>Enter either an Igbo or English to term to see the data associated with it.</p>
      <p>
        This is an open-source project, so feel free to contribute in order to make it more useful in the future.
      </p>
      <p>
        {'Have a specific question that needs answering? Email '}
        <a className="link" href={`mailto:${FROM_EMAIL}`}>{FROM_EMAIL}</a>
      </p>
    </div>
    {process.env.NODE_ENV !== 'production' ? <WelcomeCarousel /> : null}
  </div>
);

export default Home;
