import React, { useState } from 'react';
import { Box, SlideFade, Text, useToast } from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';
import ValidAudioType from './ValidAudioType';

const ACCEPT_FILE_TYPES = Object.values(ValidAudioType).join(', ');

const DragState = () => {
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(e.dataTransfer.types.indexOf('Files') !== -1);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (ACCEPT_FILE_TYPES.includes(file?.type)) {
      // const fileUrl = URL.createObjectURL(file);

      // Use fileUrl to upload to Igbo API
      toast({
        title: 'Success',
        variant: 'left-accent',
        description: 'Using uploaded audio file.',
        position: 'top',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Unable to use file',
        variant: 'left-accent',
        description: 'Please try again with valid audio file.',
        position: 'top',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      className="absolute w-full h-full"
      border={isDragging ? '2px var(--chakra-colors-gray-400) dashed' : '2px transparent dashed'}
      zIndex={isDragging ? 2 : 0}
      borderRadius="10px"
      onDragOver={onDragOver}
      onDragEnter={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Box
        className={`absolute w-full h-full transition-all ${isDragging ? 'blur-xl' : ''}`}
        borderRadius="10px"
        backgroundColor={isDragging ? 'white' : 'transparent'}
        pointerEvents={isDragging ? 'auto' : 'none'}
      />
      <Box position="absolute" className="flex w-full h-full">
        <SlideFade
          in={isDragging}
          offsetY="10px"
          className="flex w-full h-full flex-col justify-center items-center space-y-4"
        >
          <FiUpload size="36px" color="var(--chakra-colors-gray-600)" />
          <Text color="gray.600" fontWeight="semibold" fontSize="xl">
            Drag and drop audio file
          </Text>
        </SlideFade>
      </Box>
    </Box>
  );
};

export default DragState;
