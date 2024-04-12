import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../../../__tests__/components/TestContext';
import Credentials from '../credentials.page';

jest.mock('../../APIs/DevelopersAPI');

describe('Credentials', () => {
  it('renders the credentials route', async () => {
    const { findByText, findByLabelText } = render(
      <TestContext>
        <Credentials />
      </TestContext>
    );

    await findByText('API Keys');
    await findByText('All your API Keys.');
    await findByLabelText('Show and hide API Key button');
    await findByLabelText('Copy API Key button');
  });
});
