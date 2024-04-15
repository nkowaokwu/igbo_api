import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../../../__tests__/components/TestContext';
import Plans from '../plans.page';

jest.mock('../../APIs/DevelopersAPI');

describe('Plans', () => {
  it('renders the plans route', async () => {
    const { findByText } = render(
      <TestContext>
        <Plans />
      </TestContext>
    );

    await findByText('Plans');
    await findByText(/Your account is currently on the/);
  });
});
