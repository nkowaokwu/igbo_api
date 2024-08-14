import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import NavigationOptions from '../../pages/components/Navbar/NavigationOptions';
import { navigationLinks } from '../../shared/constants/navigationLinks';

describe('NavigationOptions', () => {
  it('renders the navigation options', async () => {
    const { findByText } = render(
      <TestContext>
        <NavigationOptions />
      </TestContext>
    );

    await Promise.all(navigationLinks.map(async ({ label }) => await findByText(label)));
    const igboSpeechLabel = "IgboSpeech";
    const label = await findByText(igboSpeechLabel);
    expect(label).toHaveProperty('href', 'https://speech.igboapi.com/');
  });
});
