import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import Demo from './components/Demo';
import Donate from './components/Donate';
import FadeIn from './components/FadeIn';
import Footer from './components/Footer';
import LastCall from './components/LastCall';
import MentionedIn from './components/MentionedIn';
import Navbar from './components/Navbar';
import Products from './components/Products';
import UseCases from './components/UseCases';

const App = ({ searchWord }: { searchWord: string }) => (
  <>
    <Navbar to="/" />
    <Box
      className="overflow-x-hidden flex flex-col items-center"
      id="homepage-container"
      width="full"
      pt={24}
      pb={24}
    >
      <VStack width="full" gap={24}>
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
        <UseCases />
        <Products />
        <Donate />
        <LastCall />
      </VStack>
    </Box>
    <Footer />
  </>
);
export default App;
