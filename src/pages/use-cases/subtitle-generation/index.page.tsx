/* eslint-disable max-len */
import React from 'react';
import UseCaseTemplate from 'src/pages/components/UseCaseTemplate';

const content = {
  title: 'Generate Subtitles',
  description:
    'Our innovative software provides a simple and effective way to add Igbo subtitles to your videos. Just upload your video, and our powerful algorithms will automatically transcribe the audio and translate it into fluent Igbo.',
  actionButtonLabel: 'Contact Us',
  image:
    'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  page: [
    {
      label: 'Send Audio and Receive Text',
      as: 'h1',
      description:
        'The Igbo API can handle both audio URLs and Base64 strings to easily transcription Igbo text. Transcriptions are fast and accurate so you can focus more on creating quality content.',
      image:
        'https://images.pexels.com/photos/7552374/pexels-photo-7552374.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      label: 'Support 40+ Dialects',
      as: 'h1',
      description:
        'With support of more than 40 Igbo dialects, connect and reach more Igbo speakers. No need to tell us which dialects are used, our advanced dialect-detection algorithm will be able to understand and transcribe with ease',
      image:
        'https://images.unsplash.com/photo-1572816225927-d08fb138f2b2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      label: 'Constantly Improving',
      as: 'h1',
      description:
        'Igbo is a low-resource language that has historically struggled to collect enough data to provide high quality language experience. Our system uses state-of-the-art machine learning practices to continuously improve while you use it.',
      image:
        'https://images.unsplash.com/photo-1542352526-48ef0a72c2f7?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ],
};

const SubtitleGeneration = () => <UseCaseTemplate content={content} />;

export default SubtitleGeneration;
