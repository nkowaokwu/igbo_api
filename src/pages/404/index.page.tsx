import React from 'react';
import { Box, Heading, chakra } from '@chakra-ui/react';
import Link from 'next/link';

const Error = () => (
  <Box
    style={{
      textAlign: 'center',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <Heading as="h1" style={{ fontSize: '2rem' }}>
      Something went wrong
    </Heading>
    <Link href="/" passHref>
      <chakra.span style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
        Go back to homepage
      </chakra.span>
    </Link>
  </Box>
);

export default Error;
