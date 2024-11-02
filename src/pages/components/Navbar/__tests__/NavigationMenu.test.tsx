import { render } from '@testing-library/react';
import React from 'react';
import TestContext from '../../../../__tests__/components/TestContext';
import NavigationMenu from '../NavigationMenu';

describe('NavigationMenu', () => {
  it('renders the navigation menu', async () => {
    const { findByText } = render(
      <TestContext>
        <NavigationMenu />
      </TestContext>
    );

    await findByText('Use Cases');
    // TODO: uncomment when pricing is available
    // await findByText('Pricing');
    await findByText('Resources');
    await findByText('Docs');
    await findByText('About Us');
  });
});
