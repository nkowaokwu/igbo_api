import React from 'react';
import { API_FROM_EMAIL } from '../../../siteConstants';

const Footer = () => (
  <footer className={`flex flex-col text-center lg:text-left lg:flex-row
    justify-center items-center h-40 w-full bg-gray-900`}
  >
    <div className="text-gray-300 w-11/12 lg:w-9/12">
      <h1 className="text-3xl mb-2">Igbo API</h1>
      <p>
        {'Email: '}
        <a href={`mailto:${API_FROM_EMAIL}`}>{API_FROM_EMAIL}</a>
      </p>
    </div>
  </footer>
);

export default Footer;
