import React from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { BiMicrophone } from 'react-icons/bi';
import { FiStopCircle } from 'react-icons/fi';

export const RecordButton = ({
  isActive,
  startRecording,
  stopRecording,
  pauseRecording,
}: {
  isActive: boolean,
  startRecording: () => void,
  stopRecording: () => void,
  pauseRecording: () => void,
}) => {
  const handleClick = () => {
    if (!isActive) {
      startRecording();
    } else {
      stopRecording();
      pauseRecording();
    }
  };

  return (
    <Tooltip label="Record audio">
      <IconButton
        className="border-gray-200"
        aria-label={isActive ? 'Pause' : 'Start'}
        borderRadius="100%"
        height="56px"
        width="56px"
        minWidth="56px"
        backgroundColor="transparent"
        borderWidth="1.5px"
        icon={
          isActive ? (
            <FiStopCircle size={24} className="stroke-red-500" />
          ) : (
            <BiMicrophone size={24} />
          )
        }
        onClick={handleClick}
      />
    </Tooltip>
  );
};
