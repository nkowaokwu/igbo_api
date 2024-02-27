import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiTerminal } from 'react-icons/fi';

const TryItOut = ({ size, ...props }: ButtonProps) => {
  const router = useRouter();

  return (
    <Button
      className="transition-all duration-200"
      backgroundColor="blue.500"
      _hover={{
        backgroundColor: 'blue.400',
      }}
      color="white"
      transitionDuration="200ms"
      size={size || 'lg'}
      onClick={() => {
        router.push('/#try-it-out');
        window.scrollBy({ top: -100, behavior: 'smooth' });
      }}
      leftIcon={<FiTerminal />}
      {...props}
    >
      Try it Out
    </Button>
  );
};

export default TryItOut;
