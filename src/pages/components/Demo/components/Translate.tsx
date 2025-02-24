import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  Textarea,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { MdSwapHoriz } from 'react-icons/md';
import { useState } from 'react';
import { LuRefreshCcw } from 'react-icons/lu';
import { postTranslationEndpoint } from '../../../APIs/PredictionAPI';
import LanguageEnum from 'src/shared/constants/LanguageEnum';
import languageEnumLabels from 'src/shared/constants/LanguageEnumLabels';

const Translate = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPredictLoading, setIsPredictLoading] = useState(false);
  const [translation, setTranslation] = useState('');
  const [text, setText] = useState('');
  const [languagePair, setLanguagePair] = useState({ from: LanguageEnum.IGBO, to: LanguageEnum.ENGLISH });

  const handleTranslate = async () => {
    try {
      setIsPredictLoading(true);
      const fetchedTranslation = await postTranslationEndpoint({ text, languagePair });
      setTranslation(fetchedTranslation.translation);
    } finally {
      setIsPredictLoading(false);
    }
  };

  const switchLanguagePair = () => {
    setLanguagePair({
      from: languagePair.to,
      to: languagePair.from,
    });
  };

  return (
    <Box maxWidth="1200px" width="full">
      <VStack width="full" p={4} gap={4}>
        <HStack
          flexDirection={{ base: 'column', md: 'row' }}
          width="full"
          gap={6}
          display="flex"
          position="relative"
        >
          <VStack width="full" textAlign="start">
            <Heading color="gray.800" fontSize="xl" width="full" textAlign="center">
              {languageEnumLabels[languagePair.from].label}
            </Heading>
            <Textarea
              placeholder={languagePair.from === LanguageEnum.IGBO ? 'Kedu aha gị?' : 'What is your name?'}
              height={32}
              width="full"
              p={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              fontSize="lg"
              resize="none"
            />
          </VStack>

          <Box
            position={{ base: 'relative', md: 'absolute' }}
            left={{ md: '50%' }}
            top={{ md: '60%' }}
            transform={{ md: 'translate(-50%, -60%)' }}
            zIndex={1}
          >
            <Button
              aria-label="Switch languages"
              onClick={switchLanguagePair}
              size="sm"
              rounded="full"
              bg="white"
              shadow="md"
              _hover={{ bg: 'gray.50' }}
              height="40px"
              width="40px"
            >
              {isPredictLoading ? <Spinner size="sm" /> : <Icon as={MdSwapHoriz} boxSize={5} />}
            </Button>
          </Box>

          <VStack width="full" textAlign="start">
            <Heading color="gray.800" fontSize="xl" width="full" textAlign="center">
              {languageEnumLabels[languagePair.to].label}
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
          Type in {languageEnumLabels[languagePair.from].label} to see its {languageEnumLabels[languagePair.to].label} translation
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
