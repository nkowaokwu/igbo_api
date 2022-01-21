import React from 'react';
import Link from 'next/link';

const Error = () => (
  <div
    style={{
      textAlign: 'center',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <h1 style={{ fontSize: '2rem' }}>Something went wrong</h1>
    <Link href="/" passHref>
      <span style={{ color: 'green', cursor: 'pointer', textDecoration: 'underline' }}>
        Go back to homepage
      </span>
    </Link>
  </div>
);

export default Error;
