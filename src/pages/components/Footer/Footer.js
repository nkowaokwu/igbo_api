import React from 'react';
import { useRouter } from 'next/router';
import { API_FROM_EMAIL } from '../../../siteConstants';

const Footer = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-row items-center justify-center bg-gray-800 text-white h-56">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl text-center items-center p-5">
            Interested in what you see? Register for an API Key!
          </h1>
          <button
            type="button"
            className="mt-4 rounded-full bg-green-500 text-white border-2 py-2 px-4 hover:bg-transparent
            hover:text-white hover:border-green-500 transition-all duration-200"
            onClick={() => router.push('/signup')}
          >
            Register API Key
          </button>
        </div>
      </div>
      <footer
        className={`flex flex-col text-center lg:text-left lg:flex-row
          justify-center items-center h-40 w-full bg-gray-400`}
      >
        <div className="flex flex-row items-center justify-center text-white">
          <div>
            <div className="flex justify-center mb-2">
              <div
                className="flex justify-center items-center text-gray-700
                text-center bg-white rounded-full w-12 h-12 m-2 hover:bg-gray-200
                transition-all duration-200"
              >
                <a href="https://github.com/ijemmao/igbo_api">
                  <i className="fa fa-github text-4xl p-1" />
                </a>
              </div>
              <div
                className="flex justify-center items-center text-gray-700
                text-center bg-white rounded-full w-12 h-12 m-2 hover:bg-gray-200
                transition-all duration-200"
              >
                <a className="font-normal" href={`mailto:${API_FROM_EMAIL}`}>
                  <i className="fa fa-envelope-o text-3xl p-1" />
                </a>
              </div>
            </div>
            <p className="text-black">
              {'Copyright © '}
              <span className="m-1">{new Date().getFullYear()}</span>
              Igbo API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
