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
    await findByText('About');
    await findByText('Docs');
    await findByText('Sign Up');
  });
});
