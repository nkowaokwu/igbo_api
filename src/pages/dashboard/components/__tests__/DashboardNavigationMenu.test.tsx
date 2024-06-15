import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../../../../__tests__/components/TestContext';
import DashboardNavigationMenu from '../DashboardNavigationMenu';

describe('DashboardNavigationMenu', () => {
  it('renders the dashboard navigation menu', async () => {
    const { findByText } = render(
      <TestContext>
        <DashboardNavigationMenu />
      </TestContext>
    );

    await findByText('Home');
    await findByText('Credentials');
    await findByText('Profile');
    await findByText('Plans');
  });
});
