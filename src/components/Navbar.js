import React from 'react';

const Navbar = () => (
  <ul className="responsive-container w-full justify-between items-center flex px-6 lg:px-0 py-5 text-green-900">
    <h1 id="logo" className="font-bold text-2xl text-gray-800">
      <a href="/">Nkowa okwu</a>
    </h1>
    <div className="flex space-x-6 lg:space-x-10">
      <li><a href="/" className="transition-all duration-300 hover:text-green-500">Search</a></li>
      <li><a href="/about" className="transition-all duration-300 hover:text-green-500">About</a></li>
    </div>
  </ul>
);

export default Navbar;
