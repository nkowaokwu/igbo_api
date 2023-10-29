import React from 'react';
import { Box, Link, Image, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Stat from './Stat';
import { ProjectStats } from '../../../types';

const Statistics = ({
  totalWords = 0,
  totalExamples = 0,
  totalAudioPronunciations = 0,
  totalIgboDefinitions = 0,
  totalProverbs = 0,
  totalBibleVerses = 0,
  totalNsibidiWords = 0,
  totalDevelopers = 0,
  contributors = [],
  stars = 0,
}: ProjectStats) => {
  const { t } = useTranslation('common');
  const totalSlackMembers = 320;
  return (
    <Box className="flex flex-col items-center justify-center w-full odd:space-y-6">
      <Box className="flex flex-row flex-wrap items-center justify-center w-full lg:w-9/12">
        <Stat value={totalWords} header={t('Words in the database').replace('{{number}}', `${totalWords}`)} />
        <Stat value={totalExamples} header={t('Example Igbo sentences').replace('{{number}}', `${totalExamples}`)} />
        <Stat
          value={totalAudioPronunciations}
          header={t('Word audio pronunciations').replace('{{number}}', `${totalAudioPronunciations}`)}
        />
        <Stat
          value={totalIgboDefinitions}
          header={t('Words with Igbo definitions').replace('{{number}}', `${totalIgboDefinitions}`)}
        />
        <Stat value={totalProverbs} header={t('Igbo Proverbs').replace('{{number}}', `${totalProverbs}`)} />
        <Stat value={totalBibleVerses} header={t('Bible Verses').replace('{{number}}', `${totalBibleVerses}`)} />
        <Stat value={totalNsibidiWords} header={t('Words in Nsịbịdị').replace('{{number}}', `${totalNsibidiWords}`)} />
        <Stat value={totalDevelopers} header={t('Developers using the Igbo API')} />
      </Box>
      <Box className="flex flex-row flex-wrap items-center justify-center w-full lg:w-9/12">
        {contributors ? (
          <Stat
            value={contributors.length - 1}
            header={t('GitHub Contributors').replace('{{number}}', `${contributors.length - 1}`)}
          >
            <Box className="flex flex-row flex-wrap items-center justify-center mt-4">
              {contributors
                .slice(0, 18)
                .filter(({ login }) => login !== 'semantic-release-bot')
                .map((contributor) => (
                  <Tooltip key={contributor.login} label={`@${contributor.login}`}>
                    <Box key={contributor.avatar_url}>
                      <Link href={contributor.html_url}>
                        <Image
                          src={contributor.avatar_url}
                          className="w-10 m-2 text-gray-700 bg-gray-400 rounded-full "
                          alt="github avatar"
                        />
                      </Link>
                    </Box>
                  </Tooltip>
                ))}
            </Box>
          </Stat>
        ) : null}
        <Stat
          value={totalSlackMembers}
          header={t('Members in Slack').replace('{{number}}', `${totalSlackMembers}`)}
          exact={false}
        />
        <Stat value={stars} header={t('GitHub stars').replace('{{number}}', `${stars}`)} />
      </Box>
    </Box>
  );
};

export default Statistics;
