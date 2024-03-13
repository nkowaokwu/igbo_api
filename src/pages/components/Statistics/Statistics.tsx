import React from 'react';
import { Box, Heading, Text, Link, Image, Tooltip } from '@chakra-ui/react';
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
  const totalSlackMembers = 320;
  return (
    <Box className="flex flex-col items-center justify-center w-full odd:space-y-6">
      <Heading as="h2" id="try-it-out" className="text-4xl font-bold" fontSize="6xl">
        Crunching the Numbers
      </Heading>
      <Text className="px-6 lg:px-0 lg:pb-12 text-gray-500">
        The Igbo API is the most robust, Igbo-English dictionary API that is maintained by our
        wonderful volunteer community.
      </Text>
      <Box className="flex flex-row flex-wrap items-center justify-center w-full lg:w-9/12">
        <Stat value={totalWords} header="Words in the database" />
        <Stat value={totalExamples} header="Example Igbo sentences" />
        <Stat value={totalAudioPronunciations} header="Word audio pronunciations" />
        <Stat value={totalIgboDefinitions} header="Words with Igbo definitions" />
        <Stat value={totalProverbs} header="Igbo Proverbs" />
        <Stat value={totalBibleVerses} header="Bible Verses" />
        <Stat value={totalNsibidiWords} header="Words in Nsịbịdị" />
        <Stat value={totalDevelopers} header="Developers using the Igbo API" />
      </Box>
      <Box className="flex flex-row flex-wrap items-center justify-center w-full lg:w-9/12">
        {contributors ? (
          <Stat value={contributors.length - 1} header="GitHub Contributors">
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
        <Stat value={totalSlackMembers} header="Members in Slack" exact={false} />
        <Stat value={stars} header="GitHub stars" />
      </Box>
    </Box>
  );
};

export default Statistics;
