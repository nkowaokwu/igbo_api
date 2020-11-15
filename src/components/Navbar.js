import React from 'react';
import Logo from '../assets/images/logo.svg';

const Navbar = () => (
  <ul className="responsive-container justify-between items-center flex px-6 lg:px-3 py-5 text-green-900">
    <a href="/">
      <img id="logo" src={Logo} alt="Logo that says 'Nkowa okwu'" />
    </a>
    <div className="flex space-x-6 lg:space-x-10">
      <li><a href="/" className="transition-all duration-300 hover:text-green-500">Search</a></li>
      <li><a href="/about" className="transition-all duration-300 hover:text-green-500">About</a></li>
    </div>
  </ul>
);

export default Navbar;
