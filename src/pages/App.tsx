import { Box, Heading, Text } from '@chakra-ui/react';
import Demo from './components/Demo';
import FadeIn from './components/FadeIn';
import LastCall from './components/LastCall';
import MentionedIn from './components/MentionedIn';
import Products from './components/Products';

const App = ({
  searchWord,
}: {
  searchWord: string,
  // databaseStats: DatabaseStats,
  // gitHubStats: GitHubStats,
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
                An advanced, open-source AI platform to promote the Igbo language through language
                technology
              </Text>
            </Box>
          </FadeIn>
        </Box>
      </Box>
      <Demo searchWord={searchWord} />
      <MentionedIn />
      <Products />
      {/* <Features /> */}
      {/* <Statistics {...databaseStats} {...gitHubStats} /> */}
      <LastCall />
    </Box>
  </Box>
);
export default App;
