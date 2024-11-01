import axios from 'axios';
import { SPEECH_TO_TEXT_API } from '../../../functions/build/src/config';
import { API_ROUTE, MAIN_KEY } from '../../config';
import { TEST_ONLY } from '../../functions';
import DemoOption from '../../shared/constants/DemoOption';
import Endpoint from '../../shared/constants/Endpoint';
import LanguageEnum from '../../shared/constants/LanguageEnum';

const { demoInternal } = TEST_ONLY;

describe('Firebase functions', () => {
  it('fetches speech to text', async () => {
    const base64 = 'base64';
    const audioUrl = 'audioUrl';
    const requestSpy = jest.spyOn(axios, 'request').mockResolvedValueOnce({ data: { audioUrl } });
    await demoInternal({ type: DemoOption.SPEECH_TO_TEXT, data: { base64 } });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: `${SPEECH_TO_TEXT_API}/${Endpoint.AUDIO}`,
      data: { base64 },
    });

    expect(requestSpy).toHaveBeenLastCalledWith({
      method: 'POST',
      url: `${API_ROUTE}/api/v2/speech-to-text`,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MAIN_KEY,
      },
      data: { audioUrl },
    });
  });

  it('fetches dictionary', async () => {
    const keyword = 'eat';
    const params = { dialects: true, examples: true };
    const requestSpy = jest.spyOn(axios, 'request').mockResolvedValueOnce({ data: { words: [] } });
    await demoInternal({ type: DemoOption.DICTIONARY, data: { keyword, params } });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: `${API_ROUTE}/api/v2/words?keyword=${keyword}`,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MAIN_KEY,
      },
      params,
    });
  });

  it('fetches translate', async () => {
    const text = 'text';
    const sourceLanguageCode = LanguageEnum.IGBO;
    const destinationLanguageCode = LanguageEnum.ENGLISH;
    const requestSpy = jest.spyOn(axios, 'request').mockResolvedValueOnce({ data: { words: [] } });
    await demoInternal({
      type: DemoOption.TRANSLATE,
      data: { text, sourceLanguageCode, destinationLanguageCode },
    });

    expect(requestSpy).toHaveBeenCalledWith({
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
    });
  });

  it('throws invalid demo type error', async () => {
    // @ts-expect-error invalid payload for test
    demoInternal({ type: 'UNSPECIFIED', data: {} }).catch((err) => {
      expect(err.message).toEqual('Invalid demo type.');
    });
  });
});
