import React, { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';
import ValidAudioType from '../ValidAudioType';

const ACCEPT_FILE_TYPES = Object.values(ValidAudioType).join(', ');

export const UploadButton = () => {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const handleClick = () => {
    if (inputRef) {
      inputRef.click();
    }
  };

  const handleFileChange = () => {
    const file = inputRef?.files?.[0];
    if (file) {
      // const fileUrl = URL.createObjectURL(file);
    }
  };

  useEffect(() => {
    if (inputRef) {
      inputRef.addEventListener('change', handleFileChange);

      return () => {
        inputRef.removeEventListener('change', handleFileChange);
      };
    }
    return () => null;
  }, [inputRef]);

  return (
    <>
      <input
        ref={setInputRef}
        data-test="audio-file-input"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        type="file"
        accept={ACCEPT_FILE_TYPES}
      />
      <Tooltip label="Upload audio file">
        <IconButton
          className="border-gray-200"
          aria-label="Upload"
          borderRadius="100%"
          height="56px"
          width="56px"
          minWidth="56px"
          backgroundColor="transparent"
          borderWidth="1.5px"
          icon={<FiUploadCloud size={22} />}
          onClick={handleClick}
        />
      </Tooltip>
    </>
  );
};
