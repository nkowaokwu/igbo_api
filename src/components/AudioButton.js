import React from 'react';
import AudioIcon from '../assets/sound.svg';

const AudioButton = () => (
  <div
    className="flex justify-center items-center h-10 w-10 p-2 my-5 bg-gray-200 rounded-full cursor-pointer"
  >
    <AudioIcon />
  </div>
);

export default AudioButton;
