import React from 'react';
import { useRouter } from 'next/router';
import { API_FROM_EMAIL } from '../../../siteConstants';

const Footer = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-row   items-center justify-center bg-gray-800 text-white h-56 mb-4">
        <div>
          <h1 className="text-2xl mb-2">Interested in what you see? Register for an API Key!</h1>
          <button
            type="button"
            className="mt-4 rounded-full bg-green-500 text-white border-2 py-2 px-4 mr-8 hover:bg-transparent
            hover:text-white hover:border-green-500 ml-56 rFix"
            onClick={() => router.push('/signup')}
          >
            Register API Key
          </button>
        </div>
      </div>
      <footer className={`flex flex-col text-center lg:text-left lg:flex-row
          justify-center items-center h-40 w-full bg-gray-400`}
      >
        <div className="flex flex-row   items-center justify-center text-white">
          <div>
            <div className="flex justify-center mb-2">
              <div className="text-gray-700 text-center bg-white rounded-full w-12 h-12 m-2">
                <a href="https://github.com/ijemmao/igbo_api">
                  <i className="fa fa-github text-4xl p-1" />
                </a>
              </div>
              <div className="text-gray-700 text-center bg-white rounded-full w-12 h-12 m-2">
                <a className="font-normal" href={`mailto:${API_FROM_EMAIL}`}>
                  <i className="fa fa-envelope-o text-3xl p-1" />
                </a>
              </div>
            </div>
            <p className="text-black">Copyright © 2021 Igbo API</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
