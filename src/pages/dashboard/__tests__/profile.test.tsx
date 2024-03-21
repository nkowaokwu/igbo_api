import React from 'react';
import moment from 'moment';
import { render } from '@testing-library/react';
import TestContext from '../../../__tests__/components/TestContext';
import Profile from '../profile';

describe('Profile', () => {
  it('renders the dashboard profile route', async () => {
    const { findAllByText, findByText } = render(
      <TestContext>
        <Profile />
      </TestContext>
    );

    await findAllByText('Home');
    await findByText('Your usage across all IgboAPI services.');
    await findByText('Daily IgboAPI Usage');
    await findByText(/Daily limit:/);
    await findByText(moment().format('MMMM DD, YYYY'));
  });
});
