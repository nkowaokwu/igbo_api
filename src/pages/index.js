import React, { useContext } from 'react';
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import WelcomeCarousel from '../components/WelcomeCarousel';
import { homeTourSteps } from '../shared/constants/tours';
import { FROM_EMAIL } from '../config';

const Home = () => {
  const tour = useContext(ShepherdTourContext);
  return (
    <div className="page-container">
      <Navbar />
      <SearchBar />
      <div className="flex flex-col self-center w-10/12 lg:w-6/12 mt-5 lg:mt-8 space-y-4 text-gray-600">
        <p>
          Nkowa ọkwu is an online Igbo-English dictionary. It for searching Igbo words using either Igbo or English.
        </p>
        <p>Enter either an Igbo or English to term to see the data associated with it.</p>
        <p>
          This is an open-source project, so feel free to contribute in order to make it more useful in the future.
        </p>
        <p>
          {'Have a specific question that needs answering? Email '}
          <a className="link" href={`mailto:${FROM_EMAIL}`}>{FROM_EMAIL}</a>
        </p>
      </div>
      {process.env.NODE_ENV !== 'production' ? <WelcomeCarousel tour={tour} /> : null}
    </div>
  );
};

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
};

export default process.env.NODE_ENV !== 'production' ? (props) => (
  <ShepherdTour steps={homeTourSteps} tourOptions={tourOptions}>
    <Home {...props} />
  </ShepherdTour>
) : Home;
