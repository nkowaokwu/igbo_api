import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import NavigationMenu from '../../pages/components/Navbar/NavigationMenu';
import { navigationLinks } from '../../shared/constants/navigationLinks';

describe('NavigationMenu', () => {
  it('renders the navigation menu', async () => {
    const { findByText } = render(
      <TestContext>
        <NavigationMenu />
      </TestContext>
    );

    await Promise.all(navigationLinks.map(async ({ label }) => await findByText(label)));
  });
});
