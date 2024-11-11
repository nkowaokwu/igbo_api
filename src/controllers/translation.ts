import axios from 'axios';
import { MiddleWare } from '../types';
import { ENGLIGH_TO_IGBO_API, IGBO_TO_ENGLISH_API, MAIN_KEY } from '../config';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import LanguageEnum from '../shared/constants/LanguageEnum';

const TranslationRequestBody = z.object({
  text: z.string(),
  sourceLanguageCode: z.nativeEnum(LanguageEnum),
  destinationLanguageCode: z.nativeEnum(LanguageEnum),
});

export interface Translation {
  translation: string;
}

// TODO: move this information to remote config
const SUPPORTED_TRANSLATIONS = {
  [`${LanguageEnum.IGBO}to${LanguageEnum.ENGLISH}`]: {
    maxInputLength: 120,
    translationAPI: IGBO_TO_ENGLISH_API,
  },
  [`${LanguageEnum.ENGLISH}to${LanguageEnum.IGBO}`]: {
    maxInputLength: 150,
    translationAPI: ENGLIGH_TO_IGBO_API,
  },
} as const;
type SupportedTranslationCodes = keyof typeof SUPPORTED_TRANSLATIONS;

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

    if (requestBody.sourceLanguageCode === requestBody.destinationLanguageCode) {
      throw new Error('Source and destination languages must be different');
    }

    if (
      !(
        `${requestBody.sourceLanguageCode}to${requestBody.destinationLanguageCode}` in
        SUPPORTED_TRANSLATIONS
      )
    ) {
      throw new Error(
        `${requestBody.sourceLanguageCode} to ${requestBody.destinationLanguageCode} translation is not yet supported`
      );
    }
    const textToTranslate = requestBody.text;
    if (!textToTranslate) {
      throw new Error('Cannot translate empty string');
    }
    const translationKey =
      `${requestBody.sourceLanguageCode}to${requestBody.destinationLanguageCode}` as SupportedTranslationCodes;
    // TODO: update this use map based on language
    if (textToTranslate.length > SUPPORTED_TRANSLATIONS[translationKey].maxInputLength) {
      throw new Error(
        `Cannot translate text greater than ${SUPPORTED_TRANSLATIONS[translationKey].maxInputLength} characters`
      );
    }

    // TODO: joint model will standardize request
    const payload =
      translationKey == 'ibotoeng' ? { igbo: textToTranslate } : { english: textToTranslate };

    // Talks to translation endpoint
    const { data: response } = await axios.request<Translation>({
      method: 'POST',
      url: SUPPORTED_TRANSLATIONS[translationKey].translationAPI,
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
