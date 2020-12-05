import React, { useEffect, useState } from 'react';
import { forEach } from 'lodash';

export default (Component, steps) => (props) => {
  const [tour, setTour] = useState(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { Tour } = require('shepherd.js').default; // eslint-disable-line
      const newTour = new Tour({
        defaultStepOptions: {
          classes: 'shadow-md bg-purple-dark',
          scrollTo: true,
        },
        useModalOverlay: true,
      });
      forEach(steps, (step) => newTour.addStep(step));
      setTour(newTour);
    }
  }, []);
  return tour ? <Component {...props} tour={tour} /> : <div>Loading...</div>;
};
