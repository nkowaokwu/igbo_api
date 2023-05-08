import React from 'react';
import { useTranslation } from 'react-i18next';
import UserInfo from './components/UserInformation';
import Navbar from './components/Navbar';

const Dashboard = () => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex flex-col items-center h-screen">
      <Navbar to="/" />
      <div
        className="flex flex-col px-8 mb-6 lg:justify-between xl:flex-row pt-10
      lg:pt-32 max-w-2xl lg:max-w-6xl h-full text-gray-800 text-lg lg:text-xl w-full"
      >
        <div className="max-w-3xl space-y-4 mb-10 text-gray-600">
          <h1 className="text-3xl text-gray-700">{t('Dashboard')}</h1>
          <UserInfo />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
