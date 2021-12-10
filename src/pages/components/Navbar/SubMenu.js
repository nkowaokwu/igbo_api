import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Link } from 'react-scroll';

const SubMenu = ({ isVisible, isHomepage, transparent }) => {
  const router = useRouter();
  const navigate = (e, url) => {
    e.preventDefault();
    router.push(url);
  };

  return (
    <nav
      className={`navbar ${transparent ? 'transparent-navbar' : ''} 
      ${isVisible ? 'visible opacity-1' : 'hidden opacity-0'}
      space-y-5 lg:space-y-0 lg:space-x-5 transition-all duration-100`}
    >
      {isHomepage ? (
        <>
          <li className="transition-element">
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
        </>
      ) : null}
      <li className="transition-element">
        <a
          href="/about"
          onClick={(e) => navigate(e, '/about')}
        >
          About
        </a>
      </li>
      <li className="transition-element">
        <a href="/docs">Docs</a>
      </li>
      <li className="transition-element">
        <button
          onClick={() => {
            router.push('/signup');
          }}
          role="link"
          type="button"
        >
          Get an API Key
        </button>
      </li>
      <li className="transition-element">
        <Link
          activeClass="nav-item-active"
          className="cursor-pointer rounded-full bg-green-500 text-white border-2
          py-2 px-4 mr-8 hover:bg-transparent hover:text-black border-green-500"
          to="try-it-out"
          spy
          smooth
          offset={-100}
          duration={600}
        >
          Try it Out
        </Link>
      </li>
    </nav>
  );
};

SubMenu.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isHomepage: PropTypes.bool,
  transparent: PropTypes.bool,
};

SubMenu.defaultProps = {
  isHomepage: false,
  transparent: false,
};

export default SubMenu;
