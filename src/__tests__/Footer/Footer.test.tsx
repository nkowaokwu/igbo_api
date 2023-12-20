import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import Footer from '../../pages/components/Footer/Footer';

describe('Footer', () => {
  it('renders the footer', async () => {
    const { findByText } = render(
      <TestContext>
        <Footer />
      </TestContext>
    );

    await findByText('Projects');
    await findByText('Igbo API');
    await findByText('Nkọwa okwu');
    await findByText('Chrome Extension');
    await findByText('Organization');
    await findByText('About');
    await findByText('Terms of Service');
    await findByText('Privacy Policy');
    await findByText('Social');
    await findByText('GitHub');
    await findByText('Twitter');
    await findByText('Instagram');
    await findByText('LinkedIn');
    await findByText('YouTube');
    await findByText('Email');
  });
});
