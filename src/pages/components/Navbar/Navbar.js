import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Link } from 'react-scroll';
import SubMenu from './SubMenu';
import IgboAPI from '../../assets/igboAPI.svg';
import downchevron from '../../assets/downchevron.svg';

const menuIcon = process.env.NODE_ENV !== 'production' ? downchevron : '/assets/downchevron.svg';

const Navbar = ({ to, isHomepage, transparent }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const matchesLargeScreenQuery = useMediaQuery('(min-width:1024px)');
  return (
    <div
      className={`flex relative lg:fixed items-center justify-between w-full py-5 lg:px-10
      ${transparent ? 'transparent' : 'bg-white bg-opacity-75'} select-none`}
      style={{ zIndex: 2 }}
    >
      <h1 className="transition-element text-3xl font-extrabold hover:text-gray-700 text-gray-900 ml-5 lg:ml-0">
        {to ? (
          <a href={to}>
            <IgboAPI />
          </a>
        ) : (
          <Link
            className="cursor-pointer"
            to="homepage-container"
            smooth
            offset={-100}
            duration={600}
          >
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
          <img src={menuIcon} alt="down arrow as menu icon" />
        </button>
      ) : null}
      {matchesLargeScreenQuery ? (
        <SubMenu isHomepage={isHomepage} transparent={transparent} />
      ) : isMenuVisible ? (
        <SubMenu isHomepage={isHomepage} transparent={transparent} />
      ) : null}
    </div>
  );
};

Navbar.propTypes = {
  to: PropTypes.string,
  isHomepage: PropTypes.bool,
  transparent: PropTypes.bool,
};

Navbar.defaultProps = {
  to: '/',
  isHomepage: false,
  transparent: false,
};

export default Navbar;
