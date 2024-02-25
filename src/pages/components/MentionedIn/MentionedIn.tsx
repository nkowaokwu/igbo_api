/* eslint-disable max-len */
import React from 'react';
import { Box, Text, Image, Link, Tooltip } from '@chakra-ui/react';

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
  <Box className="mentioned-in w-full flex flex-col justify-center items-center space-y-12">
    {' '}
    <Text textAlign="center" fontWeight="semibold" fontSize="xl">
      Mentioned in
    </Text>
    <Box
      className={`flex flex-row flex-wrap w-full md:w-6/12 space-x-4
    flex-wrap items-center justify-evenly`}
    >
      <Link href={NASDAQ.url} target="_blank" rel="noreferrer">
        <Tooltip label="Nasdaq">
          <Image src={NASDAQ.src} alt="Nasdaq logo" style={{ width: '140px' }} />
        </Tooltip>
      </Link>
      <Link href={NIGERIAN_TRIBUNE.url} target="_blank" rel="noreferrer">
        <Tooltip label="Nigerian Tribune">
          <Image src={NIGERIAN_TRIBUNE.src} alt="Nigerian Tribune logo" style={{ width: '140px' }} />
        </Tooltip>
      </Link>
      <Link href={UIU.url} target="_blank" rel="noreferrer">
        <Tooltip label="Umu Igbo Unite">
          <Image src={UIU.src} alt="Umu Igbo Unite logo" style={{ width: '110px' }} />
        </Tooltip>
      </Link>
      <Link href={BUILT_IN_AFRICA.url} target="_blank" rel="noreferrer">
        <Tooltip label="Built in Africa">
          <Image src={BUILT_IN_AFRICA.src} alt="Built in Africa logo" style={{ width: '130px' }} />
        </Tooltip>
      </Link>
      <Link href={NUESROOM.url} target="_blank" rel="noreferrer">
        <Tooltip label="Nuesroom">
          <Image src={NUESROOM.src} alt="Nuesroom logo" style={{ width: '140px' }} />
        </Tooltip>
      </Link>
      <Link href={WEDEYCODE.url} target="_blank" rel="noreferrer">
        <Tooltip label="WeDeyCode">
          <Image src={WEDEYCODE.src} alt="WeDeyCode logo" style={{ width: '90px' }} />
        </Tooltip>
      </Link>
    </Box>
  </Box>
);

export default MentionedIn;
