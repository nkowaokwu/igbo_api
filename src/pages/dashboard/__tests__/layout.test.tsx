import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../../../__tests__/components/TestContext';
import { getDeveloper } from '../../APIs/DevelopersAPI';
import Layout from '../layout';

jest.mock('../../APIs/DevelopersAPI');

describe('Layout', () => {
  it('renders the dashboard layout', async () => {
    const { findByText } = render(
      <TestContext>
        <Layout>{() => <>testing</>}</Layout>
      </TestContext>
    );

    expect(getDeveloper).toHaveBeenCalledWith('uid');

    await findByText('IgboAPI');
    await findByText('Home');
    await findByText('Profile');
    await findByText('Actions');
    await findByText('Log out');
    await findByText('testing');
  });
});
