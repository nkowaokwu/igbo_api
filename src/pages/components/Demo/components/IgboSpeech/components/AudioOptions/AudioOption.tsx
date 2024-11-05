import { Button, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { FiVolume1, FiVolume2 } from 'react-icons/fi';
import { mediaBlobUrlAtom, selectedDefaultAudioAtom } from '../../../../../../../pages/atoms';

const AudioOption = ({
  title,
  audioUrl,
  audioId,
}: {
  title: string,
  audioUrl: string,
  audioId: string,
}) => {
  const setMediaBlobUrl = useSetAtom(mediaBlobUrlAtom);
  const setSelectedDefaultAudio = useSetAtom(selectedDefaultAudioAtom);
  const [AudioIcon, setAudioIcon] = useState(<FiVolume1 />);

  const fetchAudioBlob = async () => {
    const { data: blob } = await axios({
      method: 'GET',
      url: audioUrl,
      responseType: 'blob',
      headers: {
        Authorization: '',
      },
    });
    return blob;
  };

  const setUpAudio = (blobUrl: string) => {
    const audio = new Audio();
    audio.src = blobUrl;
    audio.play();

    audio.addEventListener('playing', () => {
      audio.onplaying = () => setAudioIcon(<FiVolume2 />);
    });

    audio.addEventListener('ended', () => {
      audio.onended = () => setAudioIcon(<FiVolume1 />);
    });
  };

  const handleSelectedAudio = async () => {
    setSelectedDefaultAudio({
      audioUrl,
      audioId,
    });
    const blob = await fetchAudioBlob();
    const blobUrl = URL.createObjectURL(blob);
    setMediaBlobUrl(blobUrl);
    setUpAudio(blobUrl);

    // track('Default Audio Selection', {
    //   'Firebase User ID': user?.uid || 'N/A',
    //   Title: title,
    //   'Audio URL': audioUrl,
    // });
  };

  return (
    <Button
      borderWidth="1px"
      borderColor="gray.300"
      borderRadius="full"
      p={4}
      width="fit-content"
      backgroundColor="white"
      _hover={{ backgroundColor: 'white', borderColor: 'gray.400' }}
      _active={{ backgroundColor: 'white' }}
      _focus={{ backgroundColor: 'white' }}
      className="space-x-2"
      onClick={handleSelectedAudio}
    >
      {AudioIcon}
      <Text>{title}</Text>
    </Button>
  );
};

export default AudioOption;
