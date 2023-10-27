import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import Stat from '../../pages/components/Statistics/Stat';

describe('Stat', () => {
  it('renders the stat exact', async () => {
    const { findByText } = render(
      <TestContext>
        <Stat value={10} header="Header">
          <div>Children</div>
        </Stat>
      </TestContext>
    );

    await findByText('10');
    await findByText('Header');
    await findByText('Children');
  });
  it('renders the stat not exact', async () => {
    const { findByText } = render(
      <TestContext>
        <Stat value={10} header="Header" exact={false}>
          <div>Children</div>
        </Stat>
      </TestContext>
    );

    await findByText('10+');
    await findByText('Header');
    await findByText('Children');
  });
});
