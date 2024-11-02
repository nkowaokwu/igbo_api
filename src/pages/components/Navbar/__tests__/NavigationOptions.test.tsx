import { render } from '@testing-library/react';
import React from 'react';
import TestContext from '../../../../__tests__/components/TestContext';
import NavigationOptions from '../NavigationOptions';

describe('NavigationOptions', () => {
  it('renders the navigation options', async () => {
    const { findByText } = render(
      <TestContext>
        <NavigationOptions />
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
