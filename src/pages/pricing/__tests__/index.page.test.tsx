import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../../../__tests__/components/TestContext';
import Pricing from '../index.page';

describe('Pricing', () => {
  it('renders the pricing page', async () => {
    const { findByText } = render(
      <TestContext>
        <Pricing />
      </TestContext>
    );

    await findByText('Starter');
    await findByText('$0');
    await findByText('Get started');
    await findByText('Team');
    await findByText('$10');
    await findByText('Sign in to upgrade');
  });
});
