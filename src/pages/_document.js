import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/assets/favicon/site.webmanifest" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
          <!-- Google Analytics -->
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-WPWJ7T9V9Z"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WPWJ7T9V9Z');
          </script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
