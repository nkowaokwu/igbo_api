import React from 'react';
import moment from 'moment';
import { render } from '@testing-library/react';
import TestContext from '../../../__tests__/components/TestContext';
import Profile from '../profile.page';

jest.mock('../../APIs/DevelopersAPI');

describe('Profile', () => {
  it('renders the dashboard profile route', async () => {
    const { findAllByText, findByText } = render(
      <TestContext>
        <Profile />
      </TestContext>
    );

    await findAllByText('Home');
    await findAllByText('Profile');
    await findByText('developer');
    await findByText('email');
    // TODO: fix test
    // await findByText('Stripe Connected');
  });
});
