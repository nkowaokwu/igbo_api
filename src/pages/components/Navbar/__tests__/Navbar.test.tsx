import { render } from '@testing-library/react';
import React from 'react';
import TestContext from '../../../../__tests__/components/TestContext';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders the navbar', async () => {
    const { findByText } = render(
      <TestContext>
        <Navbar />
      </TestContext>
    );

    await findByText('Log In');
    await findByText('Get Started');
  });
});
