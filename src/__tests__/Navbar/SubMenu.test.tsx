import React from 'react';
import { noop } from 'lodash';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import SubMenu from '../../pages/components/Navbar/SubMenu';

describe('SubMenu', () => {
  it('renders the sub menu', async () => {
    const { findByText } = render(
      <TestContext>
        <SubMenu onSelect={noop} isVisible />
      </TestContext>
    );

    await findByText('Features');
    await findByText('Docs');
    await findByText('Get an API Key');
  });
});
