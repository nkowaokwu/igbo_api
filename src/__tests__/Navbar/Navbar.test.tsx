import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import Navbar from '../../pages/components/Navbar/Navbar';

describe('Navbar', () => {
  it('renders the card', async () => {
    const { findByTestId } = render(
      <TestContext>
        <Navbar to="/" />
      </TestContext>
    );

    await findByTestId('sub-menu');
  });
});
