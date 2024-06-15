import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../../../../__tests__/components/TestContext';
import DashboardMenu from '../DashboardMenu';

describe('DashboardMenu', () => {
  it('renders the dashboard menu', async () => {
    const { findByText } = render(
      <TestContext>
        <DashboardMenu />
      </TestContext>
    );
    await findByText('Log out');
  });
});
