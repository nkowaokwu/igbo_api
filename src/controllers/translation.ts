import axios from 'axios';
import { MiddleWare } from '../types';
import { ENGLIGH_TO_IGBO_API, IGBO_TO_ENGLISH_API, MAIN_KEY } from '../config';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import LanguageEnum from '../shared/constants/LanguageEnum';


export interface Translation {
  translation: string;
}

export type LanguageCode = `${LanguageEnum}`

type SupportedLanguage = {
  [key in LanguageCode]?: {
    maxInputLength: number,
    translationAPI: string,
  }
}
const SUPPORTED_TRANSLATIONS: { [key in LanguageCode]: SupportedLanguage} = {
  [LanguageEnum.IGBO]: {
    [LanguageEnum.ENGLISH]: {
      maxInputLength: 120,
      translationAPI: IGBO_TO_ENGLISH_API,
    },
  },
  [LanguageEnum.ENGLISH]: {
    [LanguageEnum.IGBO]: {
      maxInputLength: 150,
      translationAPI: ENGLIGH_TO_IGBO_API,
    },
  },
  [LanguageEnum.YORUBA]: {},
  [LanguageEnum.HAUSA]: {},
  [LanguageEnum.UNSPECIFIED]: {},
};

const TranslationRequestBody = z.object({
  text: z.string(),
  sourceLanguageCode: z.nativeEnum(LanguageEnum),
  destinationLanguageCode: z.nativeEnum(LanguageEnum),
});

const PayloadKeyMap = {
  [LanguageEnum.IGBO]: 'igbo',
  [LanguageEnum.ENGLISH]: 'english',
  [LanguageEnum.YORUBA]: 'yoruba',
  [LanguageEnum.HAUSA]: 'hausa',
  [LanguageEnum.UNSPECIFIED]: 'unspecified',
}

/**
 * Talks to Igbo-to-English translation model to translate the provided text.
 * @param req
 * @param res
 * @param next
 * @returns English text translation of the provided Igbo text
 */
export const getTranslation: MiddleWare = async (req, res, next) => {
  try {
    const requestBodyValidation = TranslationRequestBody.safeParse(req.body);
    if (!requestBodyValidation.success) {
      throw fromError(requestBodyValidation.error);
    }

    const requestBody = requestBodyValidation.data;
    const sourceLanguage = requestBody.sourceLanguageCode
    const destinationLanguage = requestBody.destinationLanguageCode

    if (sourceLanguage === destinationLanguage) {
      throw new Error('Source and destination languages must be different');
    }

    if (
      !(sourceLanguage in SUPPORTED_TRANSLATIONS &&
      destinationLanguage in SUPPORTED_TRANSLATIONS[sourceLanguage])
    ) {
      throw new Error(
        `${sourceLanguage} to ${destinationLanguage} translation is not yet supported`
      );
    }
    const textToTranslate = requestBody.text;
    const maxInputLength = SUPPORTED_TRANSLATIONS[sourceLanguage][destinationLanguage]!.maxInputLength
    if (!textToTranslate) {
      throw new Error('Cannot translate empty string');
    }

    if (textToTranslate.length > maxInputLength) {
      throw new Error(
        `Cannot translate text greater than ${maxInputLength} characters`
      );
    }

    // TODO: joint model will standardize request
    const payload = {
      [PayloadKeyMap[sourceLanguage]]: textToTranslate
    }

    // Talks to translation endpoint
    const { data: response } = await axios.request<Translation>({
      method: 'POST',
      url: SUPPORTED_TRANSLATIONS[sourceLanguage][destinationLanguage]!.translationAPI,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MAIN_KEY,
      },
      data: payload,
    });
    console.log(`sending translation: ${response.translation}`);
    return res.send({ translation: response.translation });
  } catch (err) {
    return next(err);
  }
};
