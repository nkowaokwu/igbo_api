import React from 'react';
import { API_FROM_EMAIL } from '../../../siteConstants';

const Footer = () => (
  <footer className={`flex flex-col text-center lg:text-left lg:flex-row
    justify-center items-center h-40 w-full bg-gray-900`}
  >
    <div className="flex flex-row justify-between items-end text-gray-300 w-11/12 lg:w-9/12 lg:px-24">
      <div>
        <h1 className="text-2xl mb-2">Igbo API</h1>
        <ul>
          <li><a className="transition-all duration-100 hover:text-gray-100" href="/about">About</a></li>
          <li><a className="transition-all duration-100 hover:text-gray-100" href="/docs">Docs</a></li>
        </ul>
      </div>
      <div>
        <p>{`Copyright © ${new Date().getFullYear()} Igbo API`}</p>
        <p>
          {'Email: '}
          <a className="font-normal" href={`mailto:${API_FROM_EMAIL}`}>{API_FROM_EMAIL}</a>
        </p>

      </div>
    </div>
  </footer>
);

export default Footer;
