import React from 'react';
import { Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Stat from './Stat';

interface StatisticsPropsInterface {
  totalWords: number;
  totalExamples: number;
  totalAudioPronunciations: number;
  totalIgboDefinitions: number;
  totalProverbs: number;
  totalBibleVerses: number;
  totalNsibidiWords: number;
  totalDevelopers: number;
  contributors: ContributorsInterface[];
  stars: number;
}

interface ContributorsInterface {
  login: string;
  avatar_url: string;
  html_url: string;
}

export default function Statistics({
  totalWords,
  totalExamples,
  totalAudioPronunciations,
  totalIgboDefinitions,
  totalProverbs,
  totalBibleVerses,
  totalNsibidiWords,
  totalDevelopers,
  contributors,
  stars,
}: StatisticsPropsInterface) {
  const { t } = useTranslation();
  const totalSlackMembers = 230;
  return (
    <div className="flex flex-col items-center justify-center w-full odd:space-y-6">
      <div className="flex flex-row flex-wrap items-center justify-center w-full lg:w-9/12">
        <Stat value={totalWords} header={t('Words in the database').replace('{{number}}', totalWords?.toString())} />
        <Stat
          value={totalExamples}
          header={t('Example Igbo sentences').replace('{{number}}', totalExamples?.toString())}
        />
        <Stat
          value={totalAudioPronunciations}
          header={t('Word audio pronunciations').replace('{{number}}', totalAudioPronunciations?.toString())}
        />
        <Stat
          value={totalIgboDefinitions}
          header={t('Words with Igbo definitions').replace('{{number}}', totalIgboDefinitions?.toString())}
        />
        <Stat value={totalProverbs} header={t('Igbo Proverbs').replace('{{number}}', totalProverbs?.toString())} />
        <Stat value={totalBibleVerses} header={t('Bible Verses').replace('{{number}}', totalBibleVerses?.toString())} />
        <Stat
          value={totalNsibidiWords}
          header={t('Words in Nsịbịdị').replace('{{number}}', totalNsibidiWords?.toString())}
        />
        <Stat value={totalDevelopers} header={t('Developers using the Igbo API')} />
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center w-full lg:w-9/12">
        {contributors ? (
          <Stat
            value={contributors.length - 1}
            header={t('GitHub Contributors').replace('{{number}}', (contributors.length - 1).toString())}
          >
            <div className="flex flex-row flex-wrap items-center justify-center mt-4">
              {contributors
                .slice(0, 18)
                .filter(({ login }) => login !== 'semantic-release-bot')
                .map((contributor) => (
                  <Tooltip key={contributor.login} label={`@${contributor.login}`}>
                    <div key={contributor.avatar_url}>
                      <a href={contributor.html_url}>
                        <img
                          src={contributor.avatar_url}
                          className="w-10 m-2 text-gray-700 bg-gray-400 rounded-full "
                          alt="github avatar"
                        />
                      </a>
                    </div>
                  </Tooltip>
                ))}
            </div>
          </Stat>
        ) : null}
        <Stat
          value={totalSlackMembers}
          header={t('Members in Slack').replace('{{number}}', totalSlackMembers?.toString())}
          exact={false}
        />
        <Stat value={stars} header={t('GitHub stars').replace('{{number}}', stars?.toString())} />
      </div>
    </div>
  );
}
