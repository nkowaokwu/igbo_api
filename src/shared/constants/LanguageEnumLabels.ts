import LanguageEnum from './LanguageEnum';

const languageEnumLabels: { [key in LanguageEnum]: { label: string } } = {
  [LanguageEnum.UNSPECIFIED]: { label: 'Unspecified' },
  [LanguageEnum.ENGLISH]: { label: 'English' },
  [LanguageEnum.HAUSA]: { label: 'Hausa' },
  [LanguageEnum.IGBO]: { label: 'Igbo' },
  [LanguageEnum.YORUBA]: { label: 'Yoruba' },
};

export default languageEnumLabels;
