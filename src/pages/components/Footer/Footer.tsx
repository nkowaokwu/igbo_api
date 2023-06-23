import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import {
  API_FROM_EMAIL,
  GITHUB_REPO,
  TWITTER,
  INSTAGRAM,
  LINKEDIN,
  YOUTUBE,
  NKOWAOKWU,
  NKOWAOKWU_CHROME,
  APP_URL,
} from '../../../siteConstants';

export default function Footer() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-center h-56 bg-gradient-to-t from-gray-50 to-white">
        <div className="flex flex-col items-center justify-center">
          <h1 className="items-center p-5 text-2xl text-center">
            {t('Interested in what you see? Register for an API Key!')}
          </h1>
          <button
            type="button"
            className="px-4 py-2 mt-4 text-white transition-all duration-200 bg-green-500 border-2 rounded-full hover:bg-transparent hover:text-gray-700 hover:border-green-500"
            onClick={() => router.push('/signup')}
          >
            {t('Get an API Key')}
          </button>
        </div>
      </div>
      <div className="w-full bg-gray-100" style={{ height: '1px' }} />
      <footer
        className={`flex flex-col text-center lg:text-left lg:flex-row
          justify-center w-full bg-gradient-to-t py-4`}
      >
        <div className="flex flex-row items-center justify-center">
          <div>
            <div
              className="flex flex-col items-center justify-center my-6 space-y-12 lg:flex-row lg:items-start lg:space-y-0 lg:space-x-32"
            >
              <div className="space-y-4">
                <h3 className="font-bold">Projects</h3>
                <ul className="space-y-3 list-none">
                  <li>
                    <a href={APP_URL} className="font-normal border-b border-b-gray-500">
                      Igbo API
                    </a>
                  </li>
                  <li>
                    <a href={NKOWAOKWU} className="font-normal border-b border-b-gray-500">
                      Nkọwa okwu
                    </a>
                  </li>
                  <li>
                    <a href={NKOWAOKWU_CHROME} className="font-normal border-b border-b-gray-500">
                      Chrome Extension
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold">Organization</h3>
                <ul className="space-y-3 list-none">
                  <li>
                    <a href="/about" className="font-normal border-b border-b-gray-500">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="font-normal border-b border-b-gray-500">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="font-normal border-b border-b-gray-500">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold">Social</h3>
                <ul className="space-y-3 list-none">
                  <li>
                    <a href={GITHUB_REPO} className="font-normal border-b border-b-gray-500">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href={TWITTER} className="font-normal border-b border-b-gray-500">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href={INSTAGRAM} className="font-normal border-b border-b-gray-500">
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href={LINKEDIN} className="font-normal border-b border-b-gray-500">
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href={YOUTUBE} className="font-normal border-b border-b-gray-500">
                      YouTube
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${API_FROM_EMAIL}`} className="font-normal border-b border-b-gray-500">
                      Email
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
