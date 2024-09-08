/* eslint-disable max-len */
import React from 'react';
import UseCaseTemplate from 'src/pages/components/UseCaseTemplate';

const content = {
  title: 'Transcribe Interviews',
  description:
    'Our state-of-the-art technology converts spoken Igbo words into text in real time, providing accurate and reliable transcriptions for conducting interviews. Our live transcription service ensures you never miss a word. With features like customizable vocabularies and automatic punctuation, our API adapts to your specific needs, making it ideal for professionals and individuals alike.',
  actionButtonLabel: 'Contact Us',
  image:
    'https://images.unsplash.com/photo-1611679782010-5ac7ff596d9a?q=80&w=3544&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  page: [
    {
      label: 'Real-time Accuracy',
      as: 'h1',
      description:
        'Accurate transcription of Igbo speech in real time, ensuring no words are missed. Perfect for capturing fast-paced conversations and interviews in Igbo.',
      image:
        'https://images.unsplash.com/photo-1542321888-8a6abb3ec824?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      label: 'Audio File Support',
      as: 'h1',
      description:
        'The ability to either provide audio URLs or Base64 strings for transcription allows for batch continuous processing and analysis of recorded conversations. Ideal for researchers, historians, or anyone who needs to transcribe large amounts of recorded Igbo speech.',
      image:
        'https://images.unsplash.com/photo-1526253038957-bce54e05968e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      label: 'Noise Suppression',
      as: 'h1',
      description:
        'Reduces and ignores background noise to ensure high quality transcriptions in noisy environments. Ideal for transcribing conversations in public spaces, classrooms, or outdoor settings.',
      image:
        'https://images.pexels.com/photos/27541898/pexels-photo-27541898/free-photo-of-drummers.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ],
};

const InterviewTranscription = () => <UseCaseTemplate content={content} />;

export default InterviewTranscription;
