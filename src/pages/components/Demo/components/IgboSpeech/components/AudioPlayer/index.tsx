'use client';

import { Box } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { mediaBlobUrlAtom, predictionTextAtom } from '../../../../../../atoms';
import useRecorder from '../../../../../../hooks/useRecorder';
import AudioPlayerBase from './AudioPlayerBase';
import { RecordButton } from './RecordButton';
import { UploadButton } from './UploadButton';

export const AudioPlayer = () => {
  const [mediaBlobUrl, setMediaBlobUrl] = useAtom(mediaBlobUrlAtom);
  const predictText = useAtomValue(predictionTextAtom);
  const [, setContainerRef] = useState<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioBlob, isRecording, startRecording, stopRecording, recordingDuration] = useRecorder();

  const handleStartRecording = () => {
    startRecording();
  };

  useEffect(() => {
    setMediaBlobUrl(audioBlob);
  }, [audioBlob]);

  return (
    <Box
      ref={setContainerRef}
      className="flex w-full flex-col items-center justify-center space-y-4"
    >
      <Box
        className="flex w-full flex-row items-center justify-between space-x-2"
        width={{ base: '100%', md: 600 }}
      >
        <AudioPlayerBase ref={audioRef} url={mediaBlobUrl} />
        {!(mediaBlobUrl && predictText) ? (
          <RecordButton
            isActive={status === 'recording'}
            startRecording={handleStartRecording}
            stopRecording={stopRecording}
            pauseRecording={stopRecording}
          />
        ) : null}
        {!(mediaBlobUrl && predictText) ? <UploadButton /> : null}
      </Box>
    </Box>
  );
};
