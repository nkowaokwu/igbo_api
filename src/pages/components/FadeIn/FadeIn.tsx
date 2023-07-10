import React, { ReactNode, useEffect, useState } from 'react';
import ReactFadeIn from 'react-fade-in';

interface FadeInProps {
  children: ReactNode;
}

const FadeIn = ({ children }: FadeInProps) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsBrowser(true);
    }
  }, []);
  return !isBrowser ? <div>{children}</div> : <ReactFadeIn>{children}</ReactFadeIn>;
};

export default FadeIn;
