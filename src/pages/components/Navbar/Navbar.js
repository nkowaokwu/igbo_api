import React from 'react';
import { API_ROUTE } from '../../config';

const Navbar = () => (
  <div className="flex items-center justify-between w-screen py-5 px-10">
    <h1 className="text-3xl font-extrabold hover:text-gray-700 text-gray-900"><a href="/">Igbo API</a></h1>
    <nav className="flex text-gray-800 space-x-5 list-none">
      <li className="hover:text-gray-500"><a href="#about">About</a></li>
      <li className="hover:text-gray-500"><a href="#features">Features</a></li>
      <li className="hover:text-gray-500"><a href="#try-it-out">Try it Out</a></li>
      <li className="hover:text-gray-500"><a href={`${API_ROUTE}/docs`}>Docs</a></li>
    </nav>
  </div>
);

export default Navbar;
