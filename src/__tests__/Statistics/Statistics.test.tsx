import React from 'react';
import { render } from '@testing-library/react';
import TestContext from '../components/TestContext';
import Statistics from '../../pages/components/Statistics/Statistics';

describe('Statistics', () => {
  it('renders the card', async () => {
    const props = {
      totalWords: 0,
      totalExamples: 0,
      totalAudioPronunciations: 0,
      totalIgboDefinitions: 0,
      totalProverbs: 0,
      totalBibleVerses: 0,
      totalNsibidiWords: 0,
      totalDevelopers: 0,
      contributors: [],
      stars: 0,
    };
    const { findByText } = render(
      <TestContext>
        <Statistics {...props} />
      </TestContext>
    );

    await findByText('Igbo words');
    await findByText('Igbo sentences');
    await findByText('Word recordings');
    await findByText('Igbo definitions');
    await findByText('Igbo proverbs');
    await findByText('Bible verses');
    await findByText('Nsịbịdị words');
    await findByText('Igbo API Developers');
    await findByText('GitHub Contributors');
    await findByText('Members in Slack');
  });
});
