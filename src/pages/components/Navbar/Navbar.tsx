import React, { useState } from 'react';
import Image from 'next/image';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Link } from 'react-scroll';
import SubMenu from './SubMenu';
import MenuIcon from '../../assets/downchevron.svg';

interface NavBarPropsInterface {
  to: string;
  transparent: boolean;
}

export default function Navbar({ to = '/', transparent }: NavBarPropsInterface) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const matchesLargeScreenQuery = useMediaQuery('(min-width:1024px)');
  return (
    <div
      className={`flex relative lg:fixed items-center justify-between w-full py-5 lg:px-10
      ${transparent ? 'transparent' : 'bg-white bg-opacity-75'} select-none`}
      style={{ zIndex: 2 }}
    >
      <h1 className="ml-5 text-3xl font-extrabold text-gray-900 transition-element hover:text-gray-700 lg:ml-0">
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
          <Image src={MenuIcon} alt="down arrow as menu icon" />
        </button>
      ) : null}
      <SubMenu isVisible={matchesLargeScreenQuery || isMenuVisible} transparent={transparent} />
    </div>
  );
}
