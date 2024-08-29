import axios from 'axios';
import { MiddleWare } from '../types';
import { fetchBase64Data } from './utils/fetchBase64Data';
import { parseAWSIdFromKey, parseAWSIdFromUri } from './utils/parseAWS';

const SPEECH_TO_TEXT_API = 'https://speech.igboapi.com';

interface Prediction {
  transcription: string;
}

/**
 * Talks to Speech-to-Text model to transcribe provided audio URL
 * @param req
 * @param res
 * @param next
 * @returns Audio transcription
 */
export const getTranscription: MiddleWare = async (req, res, next) => {
  try {
    const { audioUrl: audio } = req.body;
    if (!audio.startsWith('https://')) {
      throw new Error('Audio URL must be hosted publicly.');
    }

    let payload = { id: '', url: '' };
    const base64 = await fetchBase64Data(audio);

    // If the audio doesn't come from Igbo API S3, we will pass into IgboSpeech
    if (!audio.includes('igbo-api.s3.us-east-2')) {
      const { data: response } = await axios.request({
        method: 'POST',
        url: `${SPEECH_TO_TEXT_API}/audio`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: { base64 },
      });

      const audioId = parseAWSIdFromKey(response.Key);
      payload = { id: audioId, url: response.Location };
    } else {
      const audioId = parseAWSIdFromUri(audio);
      payload = { id: audioId, url: audio };
    }

    // Talks to prediction endpoint
    const { data: response } = await axios.request<Prediction>({
      method: 'POST',
      url: `${SPEECH_TO_TEXT_API}/predict`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    });

    return res.send(response);
  } catch (err) {
    return next();
  }
};
