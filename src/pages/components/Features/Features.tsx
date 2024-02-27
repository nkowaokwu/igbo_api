import React from 'react';
import { Box, Heading, Text, SlideFade } from '@chakra-ui/react';
import Card from '../Card';

const Features = () => (
  <Box>
    <Box className="w-full flex flex-col items-center lg:text-left my-6 space-y-4">
      <Heading as="h2" id="features" fontSize="6xl" className="font-bold">
        Build Igbo Apps
      </Heading>
      <Text className="text-xl px-6 lg:px-0 text-gray-500">
        The Igbo API&apos;s features enable engineers to build Igbo-focused apps
      </Text>
    </Box>
    <Box className="flex flex-col justify-between items-center w-full mt-32">
      <Box className=" w-10/12 flex flex-col items-center">
        <SlideFade in offsetY="20px">
          <Box
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
              content-center place-items-center"
          >
            <Card
              title="Multiple Definitions"
              description="Every word entry is provided with English and Igbo definitions"
              icon="🗣"
              tooltipLabel="We are adding more Igbo definitions to each word entry."
            />
            <Card
              title="Example Sentences"
              description="Every word entry is accompanied by contextual examples"
              icon="✍🏾"
              tooltipLabel="Example sentences are translated in both Igbo and English."
            />
            <Card
              title="Tone Marks"
              description="We use the acute, grave, and macron diacritic marks to denote pronunciation."
              icon="📑"
              tooltipLabel="Diacritics are used to convey the different tones present in the Igbo language."
            />
            <Card
              title="Spelling Variations"
              description="The database is structured to make it easier for
                  contributors to add dialect-specific word data."
              icon="🇳🇬"
              tooltipLabel={
                'The Igbo language has many dialects, some ' +
                'words capture this nuance by providing variant spellings.'
              }
            />
            <Card
              title="Nsịbịdị Script"
              description="Nsịbịdị is accompanied with each word entry."
              icon="𑗉"
              tooltipLabel="Nsịbịdị is a writing system created in Nigeria."
            />
            <Card
              title="Biblical Proverbs"
              description="Proverbs are associated with words that are used in those proverbs"
              icon="🤲🏾"
              tooltipLabel="Proverbs are a core aspect of the Igbo language."
            />
          </Box>
        </SlideFade>
      </Box>
    </Box>
  </Box>
);
export default Features;
