import { useCallable } from '../../pages/hooks/useCallable';
import DemoOption from '../../shared/constants/DemoOption';
import LanguageEnum from '../../shared/constants/LanguageEnum';
import { OutgoingWord } from '../../types';

export interface Prediction {
  transcription: string;
}

export interface Translation {
  translation: string;
}

export interface Dictionary {
  words: OutgoingWord[];
}

interface SpeechToTextResponse extends Prediction {
  exampleSuggestionId: string;
}

interface TranslationResponse extends Translation {}

interface DictionaryResponse extends Dictionary {}

/**
 * Calls prediction endpoint that fetches words
 * @param param0
 * @returns Words
 */
export const getDictionaryEndpoint = async ({
  keyword,
  params,
}: {
  keyword: string,
  params: { dialects?: boolean, examples?: boolean },
}): Promise<DictionaryResponse> => {
  const { data } = useCallable('demo', {
    type: DemoOption.DICTIONARY,
    data: { keyword, params },
  });
  return { words: data.result?.data || [] };
};

/**
 * Calls prediction endpoint to create a new prediction (transcription)
 * @param param0
 * @returns Transcription
 */
export const postSpeechToTextEndpoint = async ({
  base64,
}: {
  base64: string,
}): Promise<SpeechToTextResponse> => {
  const { data } = useCallable('demo', {
    type: DemoOption.SPEECH_TO_TEXT,
    data: { base64 },
  });
  return data.result || { transcription: '' };
};

/**
 * Calls prediction endpoint to create a new prediction (translation)
 * @param param0
 * @returns Translation
 */
export const postTranslationEndpoint = async ({
  text,
}: {
  text: string,
}): Promise<TranslationResponse> => {
  const { data } = useCallable('demo', {
    type: DemoOption.TRANSLATE,
    data: {
      text,
      sourceLanguageCode: LanguageEnum.IGBO,
      destinationLanguageCode: LanguageEnum.ENGLISH,
    },
  });
  return data.result || { translation: 'fdsafdafsd' };
};