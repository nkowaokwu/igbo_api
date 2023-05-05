/* eslint-disable max-len */
import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(context) {
    const initialProps = await Document.getInitialProps(context);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Metadata */}
          <meta name="title" content="Igbo API - The First African Language API" />
          <meta name="description" content="Igbo Dictionary API" />
          <meta property="og:title" content="Igbo API - The First African Language API" />
          <meta property="og:description" content="Igbo Dictionary API" />
          <meta property="twitter:title" content="Igbo API - The First African Language API" />
          <meta property="twitter:description" content="Igbo Dictionary API" />
          <meta property="twitter:image:alt" content="Igbo API - The First African Language API" />

          {/* Meta image */}
          <meta property="og:image" content="https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/icons/igbo_api/igbo_api_banner.png" />
          <meta property="twitter:image" content="https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/icons/igbo_api/igbo_api_banner.png" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://igboapi.com/" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@nkowaokwu" />
          <meta property="twitter:url" content="https://igboapi.com/" />

          {/* Favicon */}
          <link rel="apple-touch-icon" sizes="180x180" href="https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/icons/igbo_api/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/icons/igbo_api/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/icons/igbo_api/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/assets/favicon/site.webmanifest" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
