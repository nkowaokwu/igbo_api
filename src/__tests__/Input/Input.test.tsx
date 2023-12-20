import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import Input from '../../pages/components/Input/Input';

describe('Input', () => {
  it('renders the input', async () => {
    const { findByText } = render(
      <TestContext>
        <Input header="Header" type="email" />
      </TestContext>
    );

    await findByText('Header');
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('type')).toEqual('email');
  });
});
