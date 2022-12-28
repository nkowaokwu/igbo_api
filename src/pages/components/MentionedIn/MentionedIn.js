/* eslint-disable max-len */
import React from 'react';

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
  <div className="mentioned-in w-full flex justify-center items-center lg:py-16">
    <div
      className={`w-full md:w-10/12 flex flex-col md:flex-row 
    flex-wrap items-center justify-evenly md:space-x-8 lg:space-x-0 space-y-12 my-8 md:space-y-0 md:my-0`}
    >
      <a href={NASDAQ.url} target="_blank" rel="noreferrer">
        <img src={NASDAQ.src} alt="Nasdaq logo" style={{ width: '200px' }} />
      </a>
      <a href={NIGERIAN_TRIBUNE.url} target="_blank" rel="noreferrer">
        <img src={NIGERIAN_TRIBUNE.src} alt="Nigerian Tribune logo" />
      </a>
      <a href={UIU.url} target="_blank" rel="noreferrer">
        <img src={UIU.src} alt="Umu Igbo Unite logo" />
      </a>
      <a href={BUILT_IN_AFRICA.url} target="_blank" rel="noreferrer">
        <img src={BUILT_IN_AFRICA.src} alt="Built in Africa logo" />
      </a>
      <a href={NUESROOM.url} target="_blank" rel="noreferrer">
        <img src={NUESROOM.src} alt="Nuesroom logo" />
      </a>
      <a href={WEDEYCODE.url} target="_blank" rel="noreferrer">
        <img src={WEDEYCODE.src} alt="WeDeyCode logo" />
      </a>
    </div>
  </div>
);

export default MentionedIn;
