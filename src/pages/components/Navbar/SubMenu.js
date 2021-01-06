import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Link } from 'react-scroll';

const SubMenu = ({ isHomepage, transparent }) => {
  const router = useRouter();
  const navigate = (e, url) => {
    e.preventDefault();
    router.push(url);
  };

  return (
    <nav className={`navbar ${transparent ? 'transparent-navbar' : ''} space-y-5 lg:space-y-0 lg:space-x-5`}>
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
          <li className="transition-element">
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
        <a
          href="/signup"
          onClick={(e) => navigate(e, '/signup')}
        >
          Register API Key
        </a>
      </li>
      <li className="transition-element">
        <a href="/docs">Docs</a>
      </li>
    </nav>
  );
};

SubMenu.propTypes = {
  isHomepage: PropTypes.bool,
  transparent: PropTypes.bool,
};

SubMenu.defaultProps = {
  isHomepage: false,
  transparent: false,
};

export default SubMenu;
