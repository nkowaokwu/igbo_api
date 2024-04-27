import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../../../../__tests__/components/TestContext';
import NavigationOptions from '../NavigationOptions';

describe('NavigationOptions', () => {
  it('renders the navigation options', async () => {
    const { findByText } = render(
      <TestContext>
        <NavigationOptions />
      </TestContext>
    );

    await findByText('Features');
    await findByText('Pricing');
    await findByText('Docs');
    await findByText('Sign Up');
  });
});
