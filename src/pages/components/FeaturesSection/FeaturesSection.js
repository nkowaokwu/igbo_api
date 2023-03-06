import React from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import FadeReveal from 'react-reveal/Reveal';
import Card from '../Card';

const FeaturesSection = () => {
  const { t } = useTranslation();

  const cards = [{
    title: t('Definitions'),
    description: t('Each word is provided with at least one definition.'),
    icon: '🗣',
    tooltipLabel: 'All definitions are in English, while the head words are in Igbo.',
    color: 'blue.500',
  }, {
    title: t('Examples'),
    description: t('Certain words are accompanied by contextual examples.'),
    icon: '✍🏾',
    tooltipLabel: 'We are working to add at least on example Igbo sentence for each word entry.',
    color: 'green.500',
  }, {
    title: t('Tone Marks'),
    description: t('Diacritics are used to convey the different tones present in the Igbo language.'),
    icon: '📑',
    tooltipLabel: 'We use the acute, grave, and macron diacritic marks to denote pronunciation.',
    color: 'orange.500',
  }, {
    title: t('Variations'),
    description: t('The Igbo language has many dialects, some '
    + 'words capture this nuance by providing variant spellings.'),
    icon: '🇳🇬',
    tooltipLabel: 'The database is structured to make it easier for'
    + ' contributors to add dialect-specific word data.',
    color: 'purple.500',
  }, {
    title: t('Nsịbịdị'),
    description: t('Nsịbịdị is writing system was created in Nigeria.'),
    icon: '𑗉',
    tooltipLabel: 'Each headword will be accompanied with its Nsịbịdị equivalent.',
    color: 'red.500',
  }, {
    title: t('Proverbs'),
    description: t('Proverbs are a core aspect of the Igbo language.'),
    icon: '🤲🏾',
    tooltipLabel: 'Proverbs are associated with words that are used in those proverbs',
    color: 'cyan.500',
  }];

  return (
    <>
      <Box className="w-full text-center lg:text-left my-6">
        <Heading
          as="h2"
          fontSize="5xl"
          id="features"
          className="font-bold"
          color="white"
        >
          {t('Features')}
        </Heading>
      </Box>
      <Box className="flex flex-col justify-between items-start w-full mb-4 mt-8">
        <Box className="w-full flex flex-col items-center">
          <Box
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12
            mt-10 mb-24 content-center place-items-center"
          >
            <FadeReveal>
              {cards.map((card) => <Card {...card} />)}
            </FadeReveal>
          </Box>
          <Text
            color="white"
            textAlign="center"
            className="text-xl px-6 lg:px-0"
          >
            {t('featuresDescription')}
          </Text>
          <Button
            backgroundColor="green"
            color="white"
            borderColor="black"
            boxShadow="white"
            _hover={{
              backgroundColor: 'green',
            }}
          >
            {t('Request feature')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default FeaturesSection;
