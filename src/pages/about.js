import React from 'react';
import Navbar from '../components/Navbar';

const About = () => (
  <div className="flex flex-col items-center">
    <Navbar />
    <div className="w-11/12 lg:w-7/12 flex flex-col justify-start py-10">
      <h1 className="text-5xl mb-5">About</h1>
      <p className="text-xl mb-6">
        Igbo Dictionary is an online Igbo-English dictionary. It for searching
        Igbo words using either Igbo or English.
      </p>
      <p className="text-xl mb-6">
        Igbo is a rich language with more than 20 known dialects. This dictionary
        aims to make learning new Igbo words easy
      </p>
      <p className="text-xl mb-6">
        {'This website is built on top of the '}
        <a href="https://igboapi.com/" className="text-green-700">
          Igbo API
        </a>
        .
      </p>
    </div>
  </div>
);

export default About;
