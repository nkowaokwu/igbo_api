import axios from 'axios';
import * as functions from 'firebase-functions/v1';
import { API_ROUTE, MAIN_KEY, SPEECH_TO_TEXT_API } from './config';
import DemoOption from './shared/constants/DemoOption';
import Endpoint from './shared/constants/Endpoint';
import LanguageEnum from './shared/constants/LanguageEnum';

interface SpeechToTextRequest {
  base64: string;
}

export interface TranscriptionAudio {
  audioId: string;
  audioUrl: string;
}

interface TranslationRequest {
  text: string;
  sourceLanguageCode: LanguageEnum;
  destinationLanguageCode: LanguageEnum;
}

interface DictionaryRequest {
  keyword: string;
  params: {
    [key: string]: boolean,
  };
}

const fetchSpeechToText = async ({ data }: { data: SpeechToTextRequest }) => {
  const { base64 } = data;
  const { data: response } = await axios.request<TranscriptionAudio>({
    method: 'POST',
    url: `${SPEECH_TO_TEXT_API}/${Endpoint.AUDIO}`,
    data: { base64 },
  });
  return (
    await axios
      .request({
        method: 'POST',
        url: `${API_ROUTE}/api/v2/speech-to-text`,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': MAIN_KEY,
        },
        data: {
          audioUrl: response.audioUrl,
        },
      })
      .catch((err) => {
        console.log('Error while posting speech to text prediction for demo:', err);
        return { data: { transcription: '' } };
      })
  ).data;
};

const fetchDictionary = async ({ data }: { data: DictionaryRequest }) => {
  const { keyword, params } = data;
  return (
    await axios
      .request({
        method: 'GET',
        url: `${API_ROUTE}/api/v2/words?keyword=${keyword}`,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': MAIN_KEY,
        },
        params,
      })
      .catch((err) => {
        console.log('Error while fetching words for demo:', err);
        return { data: { words: [] } };
      })
  ).data;
};

const fetchTranslate = async ({ data }: { data: TranslationRequest }) => {
  const { text, sourceLanguageCode, destinationLanguageCode } = data;
  return (
    await axios
      .request({
        method: 'POST',
        url: `${API_ROUTE}/api/v2/translate`,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': MAIN_KEY,
        },
        data: {
          text,
          sourceLanguageCode,
          destinationLanguageCode,
        },
      })
      .catch((err) => {
        console.log('Error while posting translation prediction demo:', err);
        return { data: { translation: '' } };
      })
  ).data;
};

const demoInternal = async (payload: {
  type: DemoOption,
  data: SpeechToTextRequest | DictionaryRequest | TranslationRequest,
}): Promise<Error | any> => {
  const { type, data } = payload;
  let response = {};
  switch (type) {
    case DemoOption.SPEECH_TO_TEXT:
      response = await fetchSpeechToText({ data: data as SpeechToTextRequest });
      break;
    case DemoOption.DICTIONARY:
      response = await fetchDictionary({ data: data as DictionaryRequest });
      break;
    case DemoOption.TRANSLATE:
      response = await fetchTranslate({ data: data as TranslationRequest });
      break;
    default:
      throw new Error('Invalid demo type.');
  }

  return response;
};

export const onDemo = functions.https.onCall(demoInternal);

export const TEST_ONLY = { demoInternal };
