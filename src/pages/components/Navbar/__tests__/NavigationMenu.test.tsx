import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../../../../__tests__/components/TestContext';
import NavigationMenu from '../NavigationMenu';

describe('NavigationMenu', () => {
  it('renders the navigation menu', async () => {
    const { findByText } = render(
      <TestContext>
        <NavigationMenu />
      </TestContext>
    );

    await findByText('Features');
    // TODO: uncomment when pricing is available
    // await findByText('Pricing');
    await findByText('Docs');
    await findByText('Log In');
  });
});
