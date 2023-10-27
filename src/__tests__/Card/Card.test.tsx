import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import Card from '../../pages/components/Card/Card';

describe('Card', () => {
  it('renders the card', async () => {
    const { findByText } = render(
      <TestContext>
        <Card title="Title" description="Description" icon="✅" />
      </TestContext>
    );

    await findByText('Title');
    await findByText('Description');
    await findByText('✅');
  });
});
