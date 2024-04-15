import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../../../__tests__/components/TestContext';
import AuthManager from '../AuthManager';
import { routerPushMock } from '../../../../__mocks__/next/router';

describe('AuthManager', () => {
  it('sets up auth manager', async () => {
    const { findByText } = render(
      <TestContext>
        {/* @ts-expect-error AuthManager */}
        <AuthManager />
      </TestContext>
    );

    expect(routerPushMock).not.toHaveBeenCalledWith('/signup');
  });
});
