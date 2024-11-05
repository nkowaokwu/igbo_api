import { Box, HStack, Tag, TagLabel } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiBookOpen, FiMic } from 'react-icons/fi';
import { RiTranslate } from 'react-icons/ri';
import DemoOption from '../../../shared/constants/DemoOption';
import IgboAPI from './components/IgboAPI';
import IgboSpeech from './components/IgboSpeech';
import StartBuilding from './components/StartBuilding';
import Translate from './components/Translate';

const demoOptions = [
  {
    label: 'Speech-to-text',
    value: DemoOption.SPEECH_TO_TEXT,
    icon: <FiMic />,
    enabled: true,
  },
  // {
  //   label: 'Text-to-speech',
  //   value: DemoOption.TEXT_TO_SPEECH,
  //   icon: <FiVolume2 />,
  //   enabled: false,
  // },
  {
    label: 'Translate',
    value: DemoOption.TRANSLATE,
    icon: <RiTranslate />,
    enabled: true,
  },
  {
    label: 'Dictionary',
    value: DemoOption.DICTIONARY,
    icon: <FiBookOpen />,
    enabled: true,
  },
];

const Demo = ({ searchWord }: { searchWord?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [demo, setDemo] = useState(DemoOption.SPEECH_TO_TEXT);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoading(false);
    }
  }, []);

  return !isLoading ? (
    <Box className="flex flex-col items-center space-y-12 w-11/12">
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
            return <IgboSpeech />;
          case DemoOption.DICTIONARY:
            return <IgboAPI searchWord={searchWord || ''} />;
          case DemoOption.TRANSLATE:
            return <Translate />;
          default:
            return null;
        }
      })()}
      <StartBuilding />
    </Box>
  ) : null;
};

export default Demo;
