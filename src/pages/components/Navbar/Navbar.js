import React, { useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Link } from 'react-scroll';
import downchevron from '../../assets/downchevron.svg';
import { API_ROUTE } from '../../../config';

const menuIcon = process.env.NODE_ENV !== 'production' ? downchevron : `${API_ROUTE}/assets/downchevron.svg`;

const SubMenu = () => (
  <nav className={`transition-text flex flex-col lg:flex-row absolute w-screen lg:w-auto
    lg:relative text-gray-800 space-y-5 lg:space-y-0 lg:space-x-5 list-none bg-white lg:bg-transparent
    top-0 py-10 lg:py-0 mt-16 lg:mt-0 px-5 lg:px-0 shadow-md lg:shadow-none rounded-md`}
  >
    <li className="transition-element hover:text-gray-500">
      <a href="#about">About</a>
    </li>
    <li className="transition-element hover:text-gray-500">
      <Link
        activeClass="nav-item-active"
        className="cursor-pointer"
        to="features"
        spy
        smooth
        offset={-100}
        duration={600}
      >
        Features
      </Link>
    </li>
    <li className="transition-element hover:text-gray-500">
      <Link
        activeClass="nav-item-active"
        className="cursor-pointer"
        to="try-it-out"
        spy
        smooth
        offset={-100}
        duration={600}
      >
        Try it Out
      </Link>
    </li>
    <li className="transition-element hover:text-gray-500">
      <a href={`${API_ROUTE}/docs`}>Docs</a>
    </li>
  </nav>
);

const Navbar = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const matchesLargeScreenQuery = useMediaQuery('(min-width:1024px)');
  return (
    <div className="flex relative lg:fixed items-center justify-between w-full py-5 lg:px-10 bg-white bg-opacity-75">
      <h1 className="transition-element text-3xl font-extrabold hover:text-gray-700 text-gray-900 ml-5 lg:ml-0">
        <a href="/">Igbo API</a>
      </h1>
      {!matchesLargeScreenQuery ? (
        <button
          type="button"
          className={`transition-element mr-5 lg:mr-0 ${isMenuVisible ? 'transform rotate-90' : ''}`}
          onClick={() => setIsMenuVisible(!isMenuVisible)}
        >
          <img src={menuIcon} alt="down arrow as menu icon" />
        </button>
      ) : null}
      {matchesLargeScreenQuery ? (
        <SubMenu />
      ) : isMenuVisible ? (
        <SubMenu />
      ) : null}
    </div>
  );
};

export default Navbar;
