import { render } from '@testing-library/react';
import React from 'react';
import TestContext from '../../__tests__/components/TestContext';
import App from '../App';

describe('App', () => {
  it('renders the app', async () => {
    const props = {
      searchWord: '',
      // databaseStats: {
      //   totalWords: 100,
      //   totalExamples: 200,
      //   totalAudioPronunciations: 300,
      //   totalIgboDefinitions: 400,
      //   totalProverbs: 500,
      //   totalBibleVerses: 600,
      //   totalNsibidiWords: 700,
      //   totalDevelopers: 800,
      // },
      // gitHubStats: { contributors: [], stars: 900 },
    };
    const { findByText, findAllByText } = render(
      <TestContext>
        <App {...props} />
      </TestContext>
    );

    await findByText('Empowering Igbo Communication with Cutting-Edge AI');
    await findByText(
      'An advanced, open-source AI platform to promote the Igbo language through language technology'
    );
    await findByText('Start building with the Igbo API today');
  });
});
