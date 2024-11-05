import axios from 'axios';
import { MiddleWare } from '../types';
import { IGBO_TO_ENGLISH_API, MAIN_KEY } from '../config';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import LanguageEnum from '../shared/constants/LanguageEnum';

interface IgboEnglishTranslationMetadata {
  igbo: string;
}

const TranslationRequestBody = z
  .object({
    text: z.string(),
    sourceLanguageCode: z.nativeEnum(LanguageEnum),
    destinationLanguageCode: z.nativeEnum(LanguageEnum),
  })
  .strict();

interface Translation {
  translation: string;
}

// Due to limit on inputs used to train the model, the maximum
// Igbo translation input is 120 characters
const IGBO_ENGLISH_TRANSLATION_INPUT_MAX_LENGTH = 120;

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
      requestBody.sourceLanguageCode !== LanguageEnum.IGBO ||
      requestBody.destinationLanguageCode !== LanguageEnum.ENGLISH
    ) {
      throw new Error(
        `${requestBody.sourceLanguageCode} to ${requestBody.destinationLanguageCode} translation is not yet supported`
      );
    }
    const igboText = requestBody.text;
    if (!igboText) {
      throw new Error('Cannot translate empty string');
    }

    if (igboText.length > IGBO_ENGLISH_TRANSLATION_INPUT_MAX_LENGTH) {
      throw new Error('Cannot translate text greater than 120 characters');
    }

    const payload: IgboEnglishTranslationMetadata = { igbo: igboText };

    // Talks to translation endpoint
    const { data: response } = await axios.request<Translation>({
      method: 'POST',
      url: IGBO_TO_ENGLISH_API,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MAIN_KEY,
      },
      data: payload,
    });

    return res.send({ translation: response.translation });
  } catch (err) {
    return next(err);
  }
};
