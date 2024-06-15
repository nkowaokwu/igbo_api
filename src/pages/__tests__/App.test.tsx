import React from 'react';
import * as NextNavigation from 'next/navigation';
import { render } from '@testing-library/react';
import * as StatsAPI from '../StatsAPI';
import TestContext from '../../__tests__/components/TestContext';
import App from '../index.page';

jest.mock('next/navigation');
jest.mock('../StatsAPI');

describe('App', () => {
  it('renders the app', async () => {
    jest.spyOn(StatsAPI, 'getStats').mockResolvedValue({
      databaseStats: {
        totalWords: 100,
        totalExamples: 200,
        totalAudioPronunciations: 300,
        totalIgboDefinitions: 400,
        totalProverbs: 500,
        totalBibleVerses: 600,
        totalNsibidiWords: 700,
        totalDevelopers: 800,
      },
      contributors: [],
      stars: 900,
    });
    jest.spyOn(StatsAPI, 'getWords').mockResolvedValue({ data: [] });
    jest.spyOn(NextNavigation, 'useSearchParams').mockReturnValue(
      // @ts-expect-error
      new Map([
        ['dialects', ''],
        ['examples', ''],
      ])
    );
    const props = {
      searchWord: '',
      words: [],
      databaseStats: {
        totalWords: 100,
        totalExamples: 200,
        totalAudioPronunciations: 300,
        totalIgboDefinitions: 400,
        totalProverbs: 500,
        totalBibleVerses: 600,
        totalNsibidiWords: 700,
        totalDevelopers: 800,
      },
      gitHubStats: { contributors: [], stars: 900 },
    };
    const { findByText, findAllByText } = render(
      <TestContext>
        <App {...props} />
      </TestContext>
    );

    await findByText('The First African Language API');
    await findByText('100');
    await findByText('200');
    await findByText('300');
    await findByText('400');
    await findByText('500');
    await findByText('600');
    await findByText('700');
    await findByText('800');
    await findAllByText('900');
    await findByText('Start Building Today');
  });
});
