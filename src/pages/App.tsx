import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import FadeIn from './components/FadeIn';
import Demo from './components/Demo';
import Footer from './components/Footer';
import Products from './components/Products';
import Statistics from './components/Statistics';
import MentionedIn from './components/MentionedIn';
import LastCall from './components/LastCall';
import GitHubStars from './components/GitHubStars';
import Features from './components/Features';
import { DatabaseStats, GitHubStats, Word } from '../types';

const App = ({
  searchWord,
  words,
  databaseStats,
  gitHubStats = { contributors: [], stars: 0 },
}: {
  searchWord: string,
  words: Word[],
  databaseStats: DatabaseStats,
  gitHubStats: GitHubStats,
}) => (
  <Box className="overflow-x-hidden flex flex-col items-center" id="homepage-container">
    <Box className="flex flex-col items-center space-y-16 w-full">
      <Box
        className="relative flex flex-col justify-center items-center 
          w-full space-y-4"
        mt={12}
        zIndex={-1}
      >
        <FadeIn>
          <Heading
            as="h1"
            className="text-center z-1 w-8/12"
            width="full"
            fontSize={['4xl', '5xl']}
            color="gray.900"
          >
            Empowering Igbo Communication with Cutting-Edge AI
          </Heading>
        </FadeIn>
        <Box className="text-xl md:text-xl mb-4 mt-8 leading-10">
          <FadeIn>
            <Box className="w-full flex flex-col items-center">
              <Text className="text-center text-gray-500 w-full md:w-9/12">
                An advanced, open-source AI platform to promote the Igbo language through advanced
                language technology
              </Text>
            </Box>
          </FadeIn>
        </Box>
      </Box>
      <Demo searchWord={searchWord} words={words} />
      <MentionedIn />
      <Products />
      {/* <Features /> */}
      {/* <Statistics {...databaseStats} {...gitHubStats} /> */}
      <LastCall />
    </Box>
  </Box>
);
export default App;
