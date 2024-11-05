import { Box, Button, Collapse, Text, chakra } from '@chakra-ui/react';
import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import AudioOptions from './AudioOptions';
import { AudioPlayer } from './AudioPlayer';
import DragState from './DragState';

const ResultText = ({
  mediaBlobUrl,
  predictText,
}: {
  mediaBlobUrl?: string,
  predictText?: string,
}) => {
  const [isPredictLoading] = useState(false);
  const showPredictionText = mediaBlobUrl && predictText;

  const copyToClipboard = () => {
    if (predictText) {
      navigator.clipboard.writeText(predictText);
    }
  };

  return (
    <Box
      className="w-full flex flex-col justify-center items-center relative"
      maxWidth="700px"
      p={{ base: 0, md: 4 }}
      borderWidth={showPredictionText ? '1px' : '0px'}
      borderColor={showPredictionText ? 'gray.300' : 'transparent'}
      borderRadius={showPredictionText ? 'lg' : '0'}
    >
      <DragState />
      <Box
        borderColor="gray.300"
        className="w-full flex flex-row justify-between items-center mb-2"
      >
        <AudioPlayer />
      </Box>
      <Box width="full">
        <Collapse in={!predictText && !isPredictLoading} className="space-y-4 py-2">
          <Text textAlign="center" fontStyle="italic" fontSize="sm" color="gray">
            Record, upload, or select Igbo audio to transcribe into text
          </Text>
          <AudioOptions />
        </Collapse>
        <Collapse in={Boolean(predictText)}>
          <Box
            height="32"
            width="full"
            overflow="visible"
            textAlign="left"
            backgroundColor="gray.100"
            borderTopRadius="md"
            py={2}
            px={4}
          >
            <Text fontWeight="bold">
              <chakra.span>{isPredictLoading ? 'Loading...' : predictText}</chakra.span>
            </Text>
          </Box>
          <Box
            backgroundColor="gray.100"
            borderBottomRadius="lg"
            className="w-full p-4 flex flex-row justify-between items-center"
          >
            <Button
              rightIcon={<FiCopy />}
              backgroundColor="blue.600"
              px={3}
              py={0}
              color="white"
              _hover={{
                backgroundColor: 'blue.500',
              }}
              _active={{
                backgroundColor: 'blue.500',
              }}
              _focus={{
                backgroundColor: 'blue.500',
              }}
              onClick={copyToClipboard}
              isDisabled={!predictText}
              fontSize="sm"
            >
              Copy
            </Button>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default ResultText;
