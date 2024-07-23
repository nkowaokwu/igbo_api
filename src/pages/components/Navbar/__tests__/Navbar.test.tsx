import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../../../../__tests__/components/TestContext';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders the navbar', async () => {
    const { findByText } = render(
      <TestContext>
        <Navbar />
      </TestContext>
    );

    await findByText('IgboAPI');
    await findByText('Sign Up');
  });
});
