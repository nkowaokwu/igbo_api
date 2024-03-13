import React, { useEffect, useState } from 'react';
import { Box, SlideFade } from '@chakra-ui/react';

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
    <SlideFade in offsetY="20px" className="w-full">
      {children}
    </SlideFade>
  );
};

export default FadeIn;
