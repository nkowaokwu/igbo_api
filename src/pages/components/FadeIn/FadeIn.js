import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactFadeIn from 'react-fade-in';

const FadeIn = ({ children }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsBrowser(true);
    }
  }, []);
  return (
    !isBrowser
      ? <div>{children}</div>
      : (
        <ReactFadeIn>
          {children}
        </ReactFadeIn>
      )
  );
};

FadeIn.propTypes = {
  children: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.arrayOf(PropTypes.shape({}))]).isRequired,
};

export default FadeIn;
