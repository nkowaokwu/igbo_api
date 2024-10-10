import axios from 'axios';
import { MiddleWare } from '../types';
import { IGBO_TO_ENGLISH_API, MAIN_KEY } from '../config';

interface TranslationMetadata {
  igbo: string;
}

interface Translation {
  translation: string;
}

const TRANSLATION_INPUT_MAX_LENGTH = 120;

/**
 * Talks to Igbo-to-English translation model to translate the provided text.
 * @param req
 * @param res
 * @param next
 * @returns English text translation of the provided Igbo text
 */
export const getTranslation: MiddleWare = async (req, res, next) => {
  try {
    const igboText: string = req.body['igbo'];
    if (!igboText) {
      throw new Error('Cannot translate empty string');
    }

    if (igboText.length > TRANSLATION_INPUT_MAX_LENGTH) {
      throw new Error('Cannot translate text greater than 120 characters');
    }

    const payload: TranslationMetadata = { igbo: igboText };

    // Talks to prediction endpoint
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
