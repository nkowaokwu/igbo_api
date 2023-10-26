import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
// @ts-expect-error Types
import ReactFadeIn from 'react-fade-in';

const FadeIn = ({ children }: { children: any }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsBrowser(true);
    }
  }, []);
  return !isBrowser ? (
    <Box className="w-full">{children}</Box>
  ) : (
    <ReactFadeIn className="w-full">{children}</ReactFadeIn>
  );
};

export default FadeIn;
