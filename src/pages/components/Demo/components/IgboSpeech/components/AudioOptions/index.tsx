import React, { Box } from '@chakra-ui/react';
import AudioOption from './AudioOption';
import { DEFAULT_AUDIOS } from '../../../../../../../shared/constants/DefaultAudios';

const AudioOptions = () => (
  <Box className="w-full flex flex-row flex-wrap justify-center md:justify-between gap-4">
    {DEFAULT_AUDIOS.map((defaultAudio) => (
      <AudioOption key={defaultAudio.title} {...defaultAudio} />
    ))}
  </Box>
);

export default AudioOptions;
