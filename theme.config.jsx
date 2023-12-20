/* eslint-disable max-len */
import React from 'react';

export default {
  logo: <span>Igbo API Documentation</span>,
  project: {
    link: 'https://github.com/nkowaokwu/igbo_api',
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
  head: (
    <>
      {/* Metadata */}
      <meta name="title" content="Technical documentation for the Igbo API" />
      <meta name="description" content="Technical documentation for the Igbo API" />
      <meta property="og:title" content="Igbo API Documentation" />
      <meta property="og:description" content="Technical documentation for the Igbo API" />
      <meta property="twitter:title" content="Igbo API Documentation" />
      <meta property="twitter:description" content="Technical documentation for the Igbo API" />
      <meta property="twitter:image:alt" content="Igbo API Documentation" />

      {/* Meta image */}
      <meta
        property="og:image"
        content="https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/icons/igbo_api/igbo_api_banner.png"
      />
      <meta
        property="twitter:image"
        content="https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/icons/igbo_api/igbo_api_banner.png"
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://igboapi.com/" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@nkowaokwu" />
      <meta property="twitter:url" content="https://igboapi.com/" />

      {/* Favicon */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/icons/igbo_api/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/icons/igbo_api/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/icons/igbo_api/favicon/favicon-16x16.png"
      />
    </>
  ),
  footer: {
    text: (
      <span>
        ©{new Date().getFullYear()}
        <a href="https://igboapi.com" target="_blank" rel="noreferrer">
          {' Igbo API'}
        </a>
        .
      </span>
    ),
  },
  chat: {
    link: 'https://join.slack.com/t/igboapi/shared_invite/zt-p33cwdpw-LgoFkgIqV_~CwF64oQG5Hw',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="24" height="24" viewBox="0 0 512 512">
        <path d="M126.12,315.1A47.06,47.06,0,1,1,79.06,268h47.06Z" />
        <path d="M149.84,315.1a47.06,47.06,0,0,1,94.12,0V432.94a47.06,47.06,0,1,1-94.12,0Z" />
        <path d="M196.9,126.12A47.06,47.06,0,1,1,244,79.06v47.06Z" />
        <path d="M196.9,149.84a47.06,47.06,0,0,1,0,94.12H79.06a47.06,47.06,0,0,1,0-94.12Z" />
        <path d="M385.88,196.9A47.06,47.06,0,1,1,432.94,244H385.88Z" />
        <path d="M362.16,196.9a47.06,47.06,0,0,1-94.12,0V79.06a47.06,47.06,0,1,1,94.12,0Z" />
        <path d="M315.1,385.88A47.06,47.06,0,1,1,268,432.94V385.88Z" />
        <path d="M315.1,362.16a47.06,47.06,0,0,1,0-94.12H432.94a47.06,47.06,0,1,1,0,94.12Z" />
      </svg>
    ),
  },
};
