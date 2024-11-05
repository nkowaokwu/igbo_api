import axios from 'axios';
import { MAIN_KEY, SPEECH_TO_TEXT_API } from '../config';
import Endpoint from '../shared/constants/Endpoint';
import { MiddleWare } from '../types';
import { fetchBase64Data } from './utils/fetchBase64Data';
import { parseAWSIdFromUri } from './utils/parseAWS';

interface AudioMetadata {
  audioId: string;
  audioUrl: string;
}

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
    if (!audio.startsWith('https://') && !audio.startsWith('data:audio')) {
      console.log('Audio URL must either be hosted publicly or a valid base64');
      throw new Error('Audio URL must either be hosted publicly or a valid base64.');
    }

    let payload = { id: '', url: '' };
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

      payload = { id: response.audioId, url: response.audioUrl };
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
        'X-API-Key': MAIN_KEY,
      },
      data: payload,
    });

    return res.send({ transcription: response.transcription });
  } catch (err) {
    return next();
  }
};
