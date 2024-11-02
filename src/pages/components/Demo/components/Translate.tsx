import { Box, Button, Heading, HStack, Spinner, Text, Textarea, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { LuRefreshCcw } from 'react-icons/lu';
import { postTranslationEndpoint } from '../../../APIs/PredictionAPI';

const Translate = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPredictLoading, setIsPredictLoading] = useState(false);
  const [translation, setTranslation] = useState('');
  const [text, setText] = useState('');

  const handleTranslate = async () => {
    try {
      setIsPredictLoading(true);
      const fetchedTranslation = await postTranslationEndpoint({ text });
      setTranslation(fetchedTranslation.translation);
    } finally {
      setIsPredictLoading(false);
    }
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
              value={text}
              onChange={(e) => setText(e.target.value)}
              fontSize="lg"
              resize="none"
            />
          </VStack>
          <VStack width="full" textAlign="start">
            <Heading color="gray.800" fontSize="xl" width="full" textAlign="center">
              English
            </Heading>
            <Box
              height={32}
              backgroundColor="gray.50"
              width="full"
              p={2}
              overflow="overlay"
              {...(isPredictLoading
                ? { display: 'flex', justifyContent: 'center', alignItems: 'center' }
                : {})}
            >
              {isPredictLoading ? <Spinner /> : null}
              <Text fontSize="lg">{translation}</Text>
            </Box>
          </VStack>
        </HStack>
        <Text textAlign="center" fontStyle="italic" fontSize="sm" color="gray">
          Type in Igbo to see it&apos;s English translation
        </Text>
        <Button
          onClick={handleTranslate}
          backgroundColor="blue.600"
          color="white"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          _hover={{
            backgroundColor: 'blue.500',
          }}
          isLoading={isPredictLoading}
          rightIcon={
            <LuRefreshCcw
              style={{
                position: 'relative',
                left: isHovered ? 4 : 0,
                transition: 'left .2s ease',
              }}
            />
          }
          p={6}
        >
          Translate
        </Button>
      </VStack>
    </Box>
  );
};

export default Translate;
