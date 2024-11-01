import { Box, Button, Collapse, Text } from '@chakra-ui/react';
import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import { FiZap } from 'react-icons/fi';
import { postAudio, TranscriptionAudio } from '../../../../../../APIs/AudioAPI';
import { postSpeechToTextEndpoint } from '../../../../../../APIs/PredictionAPI';
import Feedback from '../../../../../../shared/constants/Feedback';
import {
  audioDataAtom,
  feedbackAtom,
  humanTranscriptionAtom,
  isFeedbackSubmittedAtom,
  mediaBlobUrlAtom,
  predictionLoadingAtom,
  predictionTextAtom,
  selectedDefaultAudioAtom,
} from '../../../../../atoms';

const ConvertToTextButton = ({
  mediaBlobUrl,
  hasPredicted,
}: {
  mediaBlobUrl: string,
  hasPredicted: boolean,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPredictLoading, setPredictLoading] = useAtom(predictionLoadingAtom);
  const [selectedDefaultAudio, setSelectedDefaultAudio] = useAtom(selectedDefaultAudioAtom);
  const setIsFeedbackSubmitted = useSetAtom(isFeedbackSubmittedAtom);
  const setAudioData = useSetAtom(audioDataAtom);
  const setPredictText = useSetAtom(predictionTextAtom);
  const setFeedback = useSetAtom(feedbackAtom);
  const setHumanTranscription = useSetAtom(humanTranscriptionAtom);
  const setMediaBlobUrl = useSetAtom(mediaBlobUrlAtom);

  const clearPredictText = () => {
    setPredictText('');
    setMediaBlobUrl('');
    setSelectedDefaultAudio(undefined);
    setIsFeedbackSubmitted(false);
    setHumanTranscription('');
    setFeedback(Feedback.UNSPECIFIED);
    setAudioData({ audioId: '', audioUrl: '' });
  };

  const predictText = async ({ audioId, audioUrl }: { audioId: string, audioUrl: string }) => {
    try {
      setPredictLoading(true);
      const startPredictionTime = performance.now();
      const { transcription } = await postSpeechToTextEndpoint({
        audioId,
        audioUrl,
      });
      const endPredictionTime = performance.now();

      setPredictText(transcription);
      setAudioData({
        audioId,
        audioUrl,
      });

      // track('Transcription', {
      //   'Firebase User ID': user?.uid || 'N/A',
      //   'Audio URL': audioUrl,
      //   'Prediction Time': `${(endPredictionTime - startPredictionTime) / 1000} seconds`,
      //   Transcription: transcription,
      // });
    } catch (err) {
      setPredictText('Error occurred.');
    } finally {
      setPredictLoading(false);
    }
  };

  const uploadToAWS = async () => {
    if (!mediaBlobUrl) return undefined;
    try {
      setPredictLoading(true);
      const res = await postAudio({ url: mediaBlobUrl });
      return res;
    } catch (err) {
      setPredictText('Error occurred.');
      setPredictLoading(false);
    } finally {
      setFeedback(Feedback.UNSPECIFIED);
    }
  };

  const handlePredictText = async () => {
    let res: TranscriptionAudio | void = undefined;

    if (selectedDefaultAudio) {
      // Construct res if working with default audio
      res = selectedDefaultAudio;
    } else {
      // Fetch audio from AWS to construct res
      res = await uploadToAWS();
      if (!res) return;
    }

    await predictText(res);
  };

  const handlePredictButtonClick = () => {
    return hasPredicted ? clearPredictText() : handlePredictText();
  };
  return (
    <Box className="w-full flex flex-col justify-center items-center space-y-3">
      <Box width="full">
        <Collapse in={isPredictLoading}>
          <Text fontSize="sm" fontStyle="italic" color="gray.500" textAlign="center">
            Prediction can take up to 30-40 seconds
          </Text>
        </Collapse>
      </Box>
      <Button
        onClick={handlePredictButtonClick}
        backgroundColor="blue.600"
        color="white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        _hover={{
          backgroundColor: 'blue.500',
        }}
        isLoading={isPredictLoading}
        isDisabled={!mediaBlobUrl}
        rightIcon={
          <FiZap
            style={{
              position: 'relative',
              left: isHovered ? 4 : 0,
              transition: 'left .2s ease',
            }}
          />
        }
        p={6}
      >
        {hasPredicted ? 'Transcribe again' : 'Transcribe'}
      </Button>
    </Box>
  );
};

export default ConvertToTextButton;
