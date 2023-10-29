/* eslint-disable max-len */
import React from 'react';
import { Box, Image, Link } from '@chakra-ui/react';

const NIGERIAN_TRIBUNE = {
  url: `https://tribuneonlineng.com/why-i-created-first-igbo-english-
  online-open-to-contribute-dictionary-app-ijemma-onwuzulike/`,
  src: 'https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/images/learningHomePage/mentionedIn/nigerianTribune.png',
};
const UIU = {
  url: 'https://www.ozisco.com/tag/nkowa-okwu/',
  src: 'https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/images/learningHomePage/mentionedIn/umuIgboUnite.png',
};
const BUILT_IN_AFRICA = {
  url: 'https://www.builtinafrica.io/blog-post/ijemma-onwuzulike-igbo-api',
  src: 'https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/images/learningHomePage/mentionedIn/builtInAfrica.png',
};
const NUESROOM = {
  url: 'https://neusroom.com/her-igbo-parents-didnt-teach-her-the-language-so-ijemma-onwuzulike-built-her-own-dictionary/',
  src: 'https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/images/learningHomePage/mentionedIn/nuesroom.png',
};
const WEDEYCODE = {
  url: 'https://www.youtube.com/watch?v=kjHi7p1j-ts',
  src: 'https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/images/learningHomePage/mentionedIn/weDeyCode.png',
};
const NASDAQ = {
  url: 'https://thecenter.nasdaq.org/foe-ijemma-onwuzulike-nkowa-okwu',
  src: 'https://nkowaokwu.s3.us-west-1.amazonaws.com/assets/images/learningHomePage/mentionedIn/nasdaq.png',
};

const MentionedIn = () => (
  <Box className="flex items-center justify-center w-full mentioned-in lg:py-16">
    <Box
      className={`w-full md:w-10/12 flex flex-col md:flex-row
    flex-wrap items-center justify-evenly md:space-x-8 lg:space-x-0 space-y-12 my-8 md:space-y-0 md:my-0`}
    >
      <Link href={NASDAQ.url} target="_blank" rel="noreferrer">
        <Image src={NASDAQ.src} alt="Nasdaq logo" style={{ width: '200px' }} />
      </Link>
      <Link href={NIGERIAN_TRIBUNE.url} target="_blank" rel="noreferrer">
        <Image src={NIGERIAN_TRIBUNE.src} alt="Nigerian Tribune logo" />
      </Link>
      <Link href={UIU.url} target="_blank" rel="noreferrer">
        <Image src={UIU.src} alt="Umu Igbo Unite logo" />
      </Link>
      <Link href={BUILT_IN_AFRICA.url} target="_blank" rel="noreferrer">
        <Image src={BUILT_IN_AFRICA.src} alt="Built in Africa logo" />
      </Link>
      <Link href={NUESROOM.url} target="_blank" rel="noreferrer">
        <Image src={NUESROOM.src} alt="Nuesroom logo" />
      </Link>
      <Link href={WEDEYCODE.url} target="_blank" rel="noreferrer">
        <Image src={WEDEYCODE.src} alt="WeDeyCode logo" />
      </Link>
    </Box>
  </Box>
);

export default MentionedIn;
