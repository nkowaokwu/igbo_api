import React from 'react';
import Image from 'next/image';
import NigerianTribune from '../../../public/icons/nigerianTribune.svg';
import UmuIgboUnite from '../../../public/icons/umuIgboUnite.svg';
import BuiltInAfrica from '../../../public/icons/builtInAfrica.svg';
import Nuesroom from '../../../public/icons/nuesroom.svg';
import WeDeyCode from '../../../public/icons/weDeyCode.svg';

const NIGERIAN_TRIBUNE = (
  `https://tribuneonlineng.com/why-i-created-first-igbo-english-
  online-open-to-contribute-dictionary-app-ijemma-onwuzulike/`
);
const UIU = (
  'https://www.ozisco.com/tag/nkowa-okwu/'
);
const BUILT_IN_AFRICA = (
  'https://www.builtinafrica.io/blog-post/ijemma-onwuzulike-igbo-api'
);
const NUESROOM = (
  'https://neusroom.com/her-igbo-parents-didnt-teach-her-the-language-so-ijemma-onwuzulike-built-her-own-dictionary/'
);
const WEDEYCODE = (
  'https://www.youtube.com/watch?v=kjHi7p1j-ts'
);

const MentionedIn = () => (
  <div className="mentioned-in w-full flex justify-center items-center lg:py-16">
    <div
      className={`w-full md:w-10/12 flex flex-col md:flex-row 
    flex-wrap items-center justify-evenly md:space-x-8 lg:space-x-0 space-y-12 my-8 md:space-y-0 md:my-0`}
    >
      <a href={NIGERIAN_TRIBUNE} target="_blank" rel="noreferrer">
        <Image {...NigerianTribune} alt="Nigerian Tribune logo" />
      </a>
      <a href={UIU} target="_blank" rel="noreferrer">
        <Image {...UmuIgboUnite} alt="Umu Igbo Unite logo" />
      </a>
      <a href={BUILT_IN_AFRICA} target="_blank" rel="noreferrer">
        <Image {...BuiltInAfrica} alt="Built in Africa logo" />
      </a>
      <a href={NUESROOM} target="_blank" rel="noreferrer">
        <Image {...Nuesroom} alt="Nuesroom logo" />
      </a>
      <a href={WEDEYCODE} target="_blank" rel="noreferrer">
        <Image {...WeDeyCode} alt="WeDeyCode logo" />
      </a>
    </div>
  </div>
);

export default MentionedIn;
