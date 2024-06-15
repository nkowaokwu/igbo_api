import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import Demo from '../../pages/components/Demo/Demo';

describe('Demo', () => {
  it('renders the demo', async () => {
    const { findByText } = render(
      <TestContext>
        <Demo defaultWord="word" />
      </TestContext>
    );

    await findByText('Enter a word below');
    await findByText('Flags');
    await findByText('Dialects');
    await findByText('Examples');
    await findByText('Submit');
    await findByText('Want to see how this data is getting used? Take a look at');
    await findByText('Response');
  });
});
