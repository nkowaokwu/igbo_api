import { Box, Heading, HStack, Text, Textarea, VStack } from '@chakra-ui/react';
import { debounce } from 'lodash';
import { ChangeEvent, useState } from 'react';
import { postTranslationEndpoint } from '../../../APIs/PredictionAPI';

const Translate = () => {
  const [translation, setTranslation] = useState('');
  const debouncedFetch = debounce(async (text: string) => {
    const translation = await postTranslationEndpoint({ text });
    setTranslation(translation.translation);
  }, 500);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    debouncedFetch(e.target.value);
  };
  return (
    <Box maxWidth="1200px" width="full">
      <VStack width="full" p={4} gap={4}>
        <HStack flexDirection={{ base: 'column', md: 'row' }} width="full" gap={6} display="flex">
          <VStack width="full" textAlign="start">
            <Heading color="gray.800" fontSize="xl" width="full" textAlign="center">
              Igbo
            </Heading>
            <Textarea
              placeholder="Kedu aha gị?"
              height={32}
              width="full"
              p={2}
              onChange={handleTextChange}
              fontSize="lg"
              resize="none"
            />
          </VStack>
          <VStack width="full" textAlign="start">
            <Heading color="gray.800" fontSize="xl" width="full" textAlign="center">
              English
            </Heading>
            <Box height={32} backgroundColor="gray.50" width="full" p={2} overflow="overlay">
              <Text fontSize="lg">{translation}</Text>
            </Box>
          </VStack>
        </HStack>
        <Text textAlign="center" fontStyle="italic" fontSize="sm" color="gray">
          Type in Igbo to see it&apos;s English translation
        </Text>
      </VStack>
    </Box>
  );
};

export default Translate;
