import DemoOption from '../../../shared/constants/DemoOption';
import LanguageEnum from '../../../shared/constants/LanguageEnum';
import * as useCallable from '../../hooks/useCallable';
import {
  getDictionaryEndpoint,
  postSpeechToTextEndpoint,
  postTranslationEndpoint,
} from '../PredictionAPI';

jest.mock('../../hooks/useCallable');

describe('PredictionAPI', () => {
  it('getDictionaryEndpoint', () => {
    const keyword = 'eat';
    const params = { dialects: true, examples: true };
    const useCallableSpy = jest.spyOn(useCallable, 'useCallable');
    getDictionaryEndpoint({ keyword, params });
    expect(useCallableSpy).toHaveBeenCalledWith('demo', {
      type: DemoOption.DICTIONARY,
      data: { keyword, params },
    });
  });

  it('postSpeechToTextEndpoint', () => {
    const base64 = 'base64';
    const useCallableSpy = jest.spyOn(useCallable, 'useCallable');
    postSpeechToTextEndpoint({ base64 });
    expect(useCallableSpy).toHaveBeenCalledWith('demo', {
      type: DemoOption.SPEECH_TO_TEXT,
      data: { base64 },
    });
  });

  it('postTranslationEndpoint', () => {
    const text = 'text';
    const useCallableSpy = jest.spyOn(useCallable, 'useCallable');
    postTranslationEndpoint({ text });
    expect(useCallableSpy).toHaveBeenCalledWith('demo', {
      type: DemoOption.TRANSLATE,
      data: {
        text,
        sourceLanguageCode: LanguageEnum.IGBO,
        destinationLanguageCode: LanguageEnum.ENGLISH,
      },
    });
  });
});
