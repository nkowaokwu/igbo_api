import React from 'react';
import * as NextNavigation from 'next/navigation';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import Demo from '../../pages/components/Demo/Demo';

jest.mock('next/navigation');

describe('Demo', () => {
  it('renders the demo', async () => {
    jest.spyOn(NextNavigation, 'useSearchParams').mockReturnValue(
      // @ts-expect-error
      new Map([
        ['dialects', ''],
        ['examples', ''],
      ])
    );
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
