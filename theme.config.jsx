import React from 'react';

export default {
  logo: <span>Igbo API Documentation</span>,
  project: {
    link: 'https://github.com/shuding/nextra',
    icon: <span>🇳🇬</span>,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Igbo API Documentation',
    };
  },
  sidebar: {
    titleComponent: ({ title }) => {
      if (title === 'docs') {
        return <>Igbo API</>;
      }
      return title;
    },
  },
  head: (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Igbo API Documentation" />
      <meta property="og:description" content="Technical documentation for the Igbo API" />
    </>
  ),
};
