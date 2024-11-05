import { Box, Button, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { LuMail } from 'react-icons/lu';
import Donate from 'src/pages/components/Donate';
import { HUGGING_FACE, SABBI_DASHBOARD } from '../../siteConstants';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const About = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <Navbar to="/" />
      <Box pt={24} className="w-full">
        <Box className="flex flex-col items-center" py={12}>
          <Box className="w-11/12 md:w-8/12 xl:w-6/12">
            <VStack width="full" px={4} alignItems="start" gap={12}>
              <Heading
                as="h1"
                className="z-1 w-8/12"
                width="full"
                fontSize={['4xl', '5xl']}
                color="gray.900"
              >
                Building High-Quality Advanced Igbo Language Technology
              </Heading>
              <VStack width="full" alignItems="start">
                <Heading as="h2" fontSize="3xl" color="gray.900">
                  The Igbo API | Building Unique Igbo Language Experiences
                </Heading>
                <Text>
                  With over 525 native languages, Nigeria is the 3rd linguistics diverse countries
                  on the platform. It&apos;s home to fourth most spoken African language: Igbo.
                  Despite there being more than 35 million speakers, popular language recognition
                  platforms like Google&apos;s Assistant, Amazon&apos;s Alexa, and Apple&apos;s Siri
                  don&apos;t offer support for native Igbo speakers to interact with technology with
                  their voice.
                </Text>
                <Text>
                  More than half the Nigerian population is projected to be connected to the
                  internet by 2027. This is a major sign that there will be more people online that
                  want to be able to community in their primary language.
                </Text>
                <Text>
                  The Igbo API is the first, open-source, multi-purpose African language API that
                  offers AI features like automatic speech recognition, machine translation, and
                  more allowing developers to build experiences that connect with a broader African
                  population.
                </Text>
              </VStack>
              <VStack width="full" alignItems="start">
                <Heading as="h2" fontSize="3xl" color="gray.900">
                  Frequently Asked Questions
                </Heading>
                <Heading as="h3" fontSize="2xl" color="gray.900">
                  What features are currently available?
                </Heading>
                <Text>
                  The Igbo API offers four different features: Speech-To-Text transcriptions, Igbo
                  to and from English translations, and an Igbo dictionary via a REST API.
                </Text>
                <Heading as="h3" fontSize="2xl" color="gray.900">
                  What data was used to train these models?
                </Heading>
                <Text>
                  Our open-source dataset can be found on our{' '}
                  <Link
                    href={HUGGING_FACE}
                    target="_blank"
                    textDecoration="underline"
                    color="blue.500"
                  >
                    Hugging Face
                  </Link>
                  . The data was sourced by an open-source community of more than 500 volunteer
                  audio recorders and translators. We were funded in 2021 by the{' '}
                  <Link href="https://lacunafund.org">Lacuna Fund</Link> that allowed us to build
                  the largest Igbo-English dictionary and a good portion of the data to train our
                  models.
                </Text>
                <Heading as="h3" fontSize="2xl" color="gray.900">
                  How can I use the Igbo API?
                </Heading>
                <Text>
                  You can get started by{' '}
                  <Link href="/signup">signing up for a developer token.</Link>
                  <br />
                  Then you can visit our <Link href="/docs">documentation site</Link> to start using
                  the Igbo API.
                </Text>
                <Heading as="h3" fontSize="2xl" color="gray.900">
                  I speak Igbo, how can I contribute?
                </Heading>
                <Text>
                  We are looking for more native Igbo speakers to record audio and translate
                  sentences. If you would like to contribute to the dataset that will directly
                  improve the quality of the model, you can create an account on{' '}
                  <Link href={SABBI_DASHBOARD} target="_blank">
                    Sabbi
                  </Link>{' '}
                  our data-protected Igbo language data collection platform.
                </Text>
              </VStack>
              <VStack alignItems="start">
                <Heading as="h3" fontSize="2xl" color="gray.900" mb={0}>
                  Have a Question? Reach out
                </Heading>
                <Link className="link" href="mailto:kedu@nkowaokwu.com">
                  <Button
                    backgroundColor="blue.600"
                    color="white"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    _hover={{
                      backgroundColor: 'blue.500',
                    }}
                    rightIcon={
                      <LuMail
                        style={{
                          position: 'relative',
                          left: isHovered ? 4 : 0,
                          transition: 'left .2s ease',
                        }}
                      />
                    }
                    p={6}
                  >
                    Contact us
                  </Button>
                </Link>
              </VStack>
            </VStack>
          </Box>
        </Box>
        <Donate />
        <Footer />
      </Box>
    </>
  );
};

export default About;
