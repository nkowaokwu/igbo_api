import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../../../../__tests__/components/TestContext';
import DashboardSideMenu from '../DashboardSideMenu';

describe('DashboardSideMenu', () => {
  it('renders the dashboard side menu', async () => {
    const { findByText } = render(
      <TestContext>
        <DashboardSideMenu />
      </TestContext>
    );

    await findByText('IgboAPI');
    await findByText('Home');
    await findByText('Credentials');
    await findByText('Profile');
  });
});
