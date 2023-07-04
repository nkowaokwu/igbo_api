import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Link } from 'react-scroll';
import SubMenu from './SubMenu';
import MenuIcon from '../../assets/downchevron.svg';

const Navbar = ({ to, transparent }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const matchesLargeScreenQuery = useMediaQuery('(min-width:1024px)');
  return (
    <div
      className={`flex fixed items-center justify-between w-full py-5 lg:px-10
      ${transparent ? 'transparent' : 'bg-white bg-opacity-75'} select-none`}
      style={{ zIndex: 2 }}
    >
      <h1 className="transition-element text-3xl font-extrabold hover:text-gray-700 text-gray-900 ml-5 lg:ml-0">
        {to ? (
          <a href={to}>
            <img src="https://igbo-api.s3.us-east-2.amazonaws.com/images/igboAPI.svg" alt="Igbo API logo" />
          </a>
        ) : (
          <Link className="cursor-pointer" to="homepage-container" smooth offset={-100} duration={600}>
            Igbo API
          </Link>
        )}
      </h1>
      {!matchesLargeScreenQuery ? (
        <button
          type="button"
          className={`transition-element mr-5 lg:mr-0 ${isMenuVisible ? 'transform rotate-90' : ''}`}
          onClick={() => setIsMenuVisible(!isMenuVisible)}
        >
          <Image {...MenuIcon} alt="down arrow as menu icon" />
        </button>
      ) : null}
      <SubMenu isVisible={matchesLargeScreenQuery || isMenuVisible} transparent={transparent} />
    </div>
  );
};

Navbar.propTypes = {
  to: PropTypes.string,
  transparent: PropTypes.bool,
};

Navbar.defaultProps = {
  to: '/',
  transparent: false,
};

export default Navbar;
