import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import FadeIn from '../../pages/components/FadeIn/FadeIn';

describe('FadeIn', () => {
  it('renders children content for fade in component', async () => {
    const { findByText } = render(
      <TestContext>
        <FadeIn>
          <div>Testing</div>
        </FadeIn>
      </TestContext>
    );

    await findByText('Testing');
  });
});
