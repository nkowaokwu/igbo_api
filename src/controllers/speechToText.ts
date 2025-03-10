import axios from 'axios';
import { IGBO_STT_API, MAIN_KEY, SPEECH_TO_TEXT_API } from '../config';
import Endpoint from '../shared/constants/Endpoint';
import { MiddleWare } from '../types';
import { fetchBase64Data } from './utils/fetchBase64Data';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { parseAWSIdFromUri } from './utils/parseAWS';

interface AudioMetadata {
  audioId: string;
  audioUrl: string;
}

interface Prediction {
  transcription: string;
}

const TranscriptionRequestBody = z.object({
  audioUrl: z.string(),
});

/**
 * Talks to Speech-to-Text model to transcribe provided audio URL
 * @param req
 * @param res
 * @param next
 * @returns Audio transcription
 */
export const getTranscription: MiddleWare = async (req, res, next) => {
  try {
    const requestBodyValidation = TranscriptionRequestBody.safeParse(req.body);
    if (!requestBodyValidation.success) {
      throw fromError(requestBodyValidation.error);
    }
    const { audioUrl: audio } = requestBodyValidation.data;
    if (!audio.startsWith('https://') && !audio.startsWith('data:audio')) {
      console.log('Audio URL must either be hosted publicly or a valid base64');
      throw new Error('Audio URL must either be hosted publicly or a valid base64.');
    }

    let payload = { audioUrl: '' };
    const base64 = audio.startsWith('https://') ? await fetchBase64Data(audio) : audio;

    // If the audio doesn't come from Igbo API S3, we will pass into IgboSpeech
    if (!audio.includes('igbo-api.s3.us-east-2')) {
      const { data: response } = await axios
        .request<AudioMetadata>({
          method: 'POST',
          url: `${SPEECH_TO_TEXT_API}/${Endpoint.AUDIO}`,
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': MAIN_KEY,
          },
          data: { base64 },
        })
        .catch((err) => {
          console.log('Error requesting /audio', err);
          return { data: { audioId: '', audioUrl: '' } };
        });

      payload = { audioUrl: response.audioUrl };
    } else {
      payload = { audioUrl: audio };
    }

    // Talks to prediction endpoint
    const { data: response } = await axios.request<Prediction>({
      method: 'POST',
      url: IGBO_STT_API,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MAIN_KEY,
      },
      data: payload,
    });

    return res.send({ transcription: response.transcription });
  } catch (err) {
    return next(err);
  }
};
