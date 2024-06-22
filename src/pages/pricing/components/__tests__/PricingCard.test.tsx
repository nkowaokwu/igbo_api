import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestContext from '../../../../__tests__/components/TestContext';
import PricingCard from '../PricingCard';
import { routerPushMock } from '../../../../../__mocks__/next/router';

describe('PricingCard', () => {
  it('renders the pricing card and clicks the button', async () => {
    const props = {
      price: 10,
      title: 'Team',
      description: 'Description',
      callToAction: 'Action',
      navigation: '/action',
      features: ['first feature'],
    };
    const { findByText } = render(
      <TestContext>
        <PricingCard {...props} />
      </TestContext>
    );

    await findByText('$10');
    await findByText('/ month');
    await findByText('Team');
    await findByText('Description');
    const actionButton = await findByText('Action');
    await findByText('first feature');
    await userEvent.click(actionButton);

    expect(routerPushMock).toHaveBeenCalledWith('/action');
  });
});
