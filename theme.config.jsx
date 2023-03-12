import React from 'react';

export default {
  logo: <span>Igbo API Documentation</span>,
  project: {
    link: 'https://github.com/nkowaokwu/igbo_api',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 .297c-6.627 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.111.82-.258.82-.577 0-.285-.011-1.04-.017-2.042-3.338.725-4.042-1.611-4.042-1.611-.546-1.385-1.334-1.754-1.334-1.754-1.089-.742.083-.727.083-.727 1.204.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.304 3.495.998.109-.776.417-1.305.76-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.465-2.38 1.235-3.219-.125-.304-.535-1.524.116-3.176 0 0 1.005-.322 3.3 1.23.96-.266 1.98-.399 3-.405 1.02.006 2.04.139 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.652 1.652.242 2.872.117 3.176.765.839 1.23 1.91 1.23 3.219 0 4.608-2.805 5.623-5.475 5.918.43.371.81 1.105.81 2.227 0 1.608-.015 2.905-.015 3.3 0 .32.21.695.825.577 4.764-1.585 8.198-6.083 8.198-11.385 0-6.627-5.373-12-12-12z" /></svg>,
    // icon: <span>🇳🇬</span>,
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
  docsRepositoryBase: 'https://github.com/nkowaokwu/igbo_api',
  //   footer: {
  //     text: 'Igbo API Documentation 2023',
  // },
  footer: {
    text: <span>
      © {new Date().getFullYear()} <a href="https://igboapi.com" target="_blank">Igbo API</a>.
    </span>,
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
  chat: {
    link: 'https://twitter.com/nkowaokwu',
    icon: <svg width="24" height="24" viewBox="0 0 248 204"><path fill="currentColor" d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07a50.338 50.338 0 0 0 22.8-.87C27.8 117.2 10.85 96.5 10.85 72.46v-.64a50.18 50.18 0 0 0 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71a143.333 143.333 0 0 0 104.08 52.76 50.532 50.532 0 0 1 14.61-48.25c20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26a50.69 50.69 0 0 1-22.2 27.93c10.01-1.18 19.79-3.86 29-7.95a102.594 102.594 0 0 1-25.2 26.16z" /></svg>,
  },
};


