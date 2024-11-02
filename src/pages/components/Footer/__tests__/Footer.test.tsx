import { render } from '@testing-library/react';
import React from 'react';
import TestContext from '../../../../__tests__/components/TestContext';
import Footer from '../../Footer/Footer';

describe('Footer', () => {
  it('renders the footer', async () => {
    const { findByText } = render(
      <TestContext>
        <Footer />
      </TestContext>
    );

    await findByText('Company');
    await findByText('Igbo API');
    await findByText('Nkọwa okwu');
    await findByText('Chrome Extension');

    await findByText('Resources');
    await findByText('Documentation');
    await findByText('Hugging Face');
    await findByText('Kaggle');
    await findByText('GitHub');

    await findByText('Legal');
    await findByText('Terms of Service');
    await findByText('Privacy Policy');
  });
});
