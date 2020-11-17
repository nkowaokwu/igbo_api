/* eslint-disable */
import React from 'react';
import Head from 'next/head';
import './fonts.css';
import './styles.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Igbo API - The First Afrifcan Language API</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};
