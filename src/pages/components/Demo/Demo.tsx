import React, { useState, useEffect } from 'react';
import { Box, Tag, TagLabel, HStack } from '@chakra-ui/react';
import { FiMic, FiBookOpen, FiVolume2 } from 'react-icons/fi';
import { RiTranslate } from 'react-icons/ri';
import { Word } from '../../../types';
import IgboAPI from './components/IgboAPI';
import StartBuilding from './components/StartBuilding';

enum DemoOption {
  SPEECH_TO_TEXT = 'speech-to-text',
  TEXT_TO_SPEECH = 'text-to-speech',
  DICTIONARY = 'dictionary',
  TRANSLATE = 'translate',
}

const demoOptions = [
  {
    label: 'Speech-to-text',
    value: DemoOption.SPEECH_TO_TEXT,
    icon: <FiMic />,
    enabled: true,
  },
  {
    label: 'Text-to-speech',
    value: DemoOption.TEXT_TO_SPEECH,
    icon: <FiVolume2 />,
    enabled: false,
  },
  {
    label: 'Dictionary API',
    value: DemoOption.DICTIONARY,
    icon: <FiBookOpen />,
    enabled: true,
  },
  {
    label: 'Translate',
    value: DemoOption.TRANSLATE,
    icon: <RiTranslate />,
    enabled: false,
  },
];

const Demo = ({ searchWord, words }: { searchWord?: string, words: Word[] }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [demo, setDemo] = useState(DemoOption.SPEECH_TO_TEXT);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoading(false);
    }
  }, []);

  return !isLoading ? (
    <Box className="flex flex-col items-center space-y-12 w-10/12">
      <HStack>
        {demoOptions.map(({ label, value, icon, enabled }) =>
          enabled ? (
            <Tag
              key={label}
              colorScheme={demo === value ? 'blue' : 'white'}
              borderRadius="full"
              borderWidth={demo === value ? '' : '1px'}
              onClick={() => setDemo(value)}
              cursor="pointer"
              size="lg"
              className="space-x-2"
            >
              {icon}
              <TagLabel>{label}</TagLabel>
            </Tag>
          ) : null
        )}
      </HStack>
      {(() => {
        switch (demo) {
          case DemoOption.SPEECH_TO_TEXT:
            return null;
          case DemoOption.DICTIONARY:
            return <IgboAPI searchWord={searchWord || ''} words={words} />;
          default:
            return null;
        }
      })()}
      <StartBuilding />
    </Box>
  ) : null;
};

export default Demo;
