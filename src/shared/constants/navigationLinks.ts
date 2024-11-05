import { GITHUB_REPO, HUGGING_FACE, KAGGLE } from '../../siteConstants';

export enum NavigationType {
  LINK = 'LINK',
  DROPDOWN = 'DROPDOWN',
}

interface NavigationLink {
  href?: string;
  label: string;
  type: NavigationType;
  options?: {
    title: string,
    subtitle: string,
    href: string,
    enabled: boolean,
    isExternal?: boolean,
  }[];
}

export const navigationLinks: NavigationLink[] = [
  // {
  //   label: 'Features',
  //   type: NavigationType.DROPDOWN,
  //   options: [
  //     // {
  //     //   title: 'Nkọwa okwu',
  //     //   subtitle: 'Advancing African Languages',
  //     //   href: DICTIONARY_APP_URL,
  //     // },
  //     {
  //       title: 'Lexical Dictionary',
  //       subtitle: 'Seamless Dictionary Integration',
  //       href: APP_URL,
  //       enabled: true,
  //     },
  //     {
  //       title: 'Live Transcription',
  //       subtitle: 'Accurate Igbo Transcriptions',
  //       href: SPEECH_TO_TEXT_APP_URL,
  //       enabled: true,
  //     },
  //     {
  //       title: 'Voice Generation',
  //       subtitle: 'Convert Text to Speech',
  //       href: '',
  //       enabled: false,
  //     },
  //     {
  //       title: 'Translate',
  //       subtitle: 'Communicate With a Larger Audience',
  //       href: '',
  //       enabled: false,
  //     },
  //     {
  //       title: 'Spell Checking',
  //       subtitle: 'Publish With Confidence',
  //       href: '',
  //       enabled: false,
  //     },
  //     {
  //       title: 'Voice Cloning',
  //       subtitle: 'Use Your Voice to Tell Stories',
  //       href: '',
  //       enabled: false,
  //     },
  //     {
  //       title: 'Image Text Extraction',
  //       subtitle: 'Preserve Your History',
  //       href: '',
  //       enabled: false,
  //     },
  //     {
  //       title: 'Data Platform',
  //       subtitle: "Archive Your Team's Data",
  //       href: '',
  //       enabled: true,
  //     },
  //   ],
  // },
  // TODO: uncomment when pricing is available
  // {
  //   href: '/pricing',
  //   label: 'Pricing',
  // },
  // {
  //   href: '',
  //   label: 'Use Cases',
  //   type: NavigationType.DROPDOWN,
  //   options: [
  //     {
  //       title: 'Generate Subtitles',
  //       subtitle: 'Convert speech into live subtitles',
  //       href: '/use-cases/subtitle-generation',
  //       enabled: true,
  //     },
  //     {
  //       title: 'Transcribe Interviews',
  //       subtitle: 'Accurately transcribe live conversations',
  //       href: '/use-cases/interview-transcription',
  //       enabled: true,
  //     },
  //     // {
  //     //   title: 'Translate Conversations',
  //     //   subtitle: 'Translate between Igbo and English',
  //     //   href: '/use-cases/translate',
  //     //   enabled: true,
  //     // },
  //   ],
  // },
  {
    label: 'Resources',
    type: NavigationType.DROPDOWN,
    options: [
      {
        title: 'Hugging Face',
        subtitle: 'Access our open-source models and datasets',
        href: HUGGING_FACE,
        enabled: true,
        isExternal: true,
      },
      {
        title: 'Kaggle',
        subtitle: 'Open-source models, datasets, and competitions',
        href: KAGGLE,
        enabled: true,
        isExternal: true,
      },
      {
        title: 'GitHub',
        subtitle: 'Open-source code',
        href: GITHUB_REPO,
        enabled: true,
        isExternal: true,
      },
    ],
  },
  {
    href: '/docs',
    label: 'Docs',
    type: NavigationType.LINK,
  },
  {
    href: '/about',
    label: 'About Us',
    type: NavigationType.LINK,
  },
];
