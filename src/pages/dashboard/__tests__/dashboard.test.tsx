import React from 'react';
import moment from 'moment';
import { render } from '@testing-library/react';
import TestContext from '../../../__tests__/components/TestContext';
import Dashboard from '../dashboard';

jest.mock('../../APIs/DevelopersAPI');

describe('Dashboard', () => {
  it('renders the dashboard main route', async () => {
    const { findAllByText, findByText } = render(
      <TestContext>
        <Dashboard />
      </TestContext>
    );

    await findAllByText('Home');
    await findAllByText('Credentials');
    await findAllByText('Profile');
    await findAllByText('Plans');
    await findByText('Your usage across all IgboAPI services.');
    await findByText('Daily IgboAPI Usage');
    await findByText(/Daily limit:/);
    await findByText(new RegExp(moment().format('MMMM DD, YYYY')));
  });
});
