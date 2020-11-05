import React from 'react';

import Navbar from '../components/Navbar';

import SearchBar from '../components/SearchBar';

const Home = () => (
  <div className="page-container">
    <Navbar />
    <div className="responsive-container flex flex-col">
      <SearchBar />
    </div>
  </div>
);

export default Home;
