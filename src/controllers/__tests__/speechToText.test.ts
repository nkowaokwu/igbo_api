import axios from 'axios';
import {
  requestFixture,
  responseFixture,
  nextFunctionFixture,
} from '../../../__tests__/shared/fixtures';
import { getTranscription } from '../speechToText';
import { fetchBase64Data } from '../utils/fetchBase64Data';

jest.mock('axios');
jest.mock('../utils/fetchBase64Data');

describe('speechToText', () => {
  it('calls audio IgboSpeech audio endpoint to upload audio', async () => {
    const req = requestFixture({ body: { audioUrl: 'https://igboapi.com' } });
    const res = responseFixture();
    const next = nextFunctionFixture();
    const base64 = 'base64';
    // @ts-expect-error
    fetchBase64Data.mockResolvedValue(base64);
    // @ts-expect-error
    axios.request.mockResolvedValue({
      data: { Key: '/audioId.com/', Location: 'https://igboapi.com' },
    });
    await getTranscription(req, res, next);
    // @ts-expect-error
    expect(axios.request.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      url: 'https://speech.igboapi.com/audio',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { base64 },
    });
    // @ts-expect-error
    expect(axios.request.mock.calls[1][0]).toMatchObject({
      method: 'POST',
      url: 'https://speech.igboapi.com/predict',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { id: 'audioId', url: 'https://igboapi.com' },
    });
  });

  it('does not call audio IgboSpeech audio endpoint to upload audio', async () => {
    jest.resetAllMocks();
    const audioUrl = 'https://igbo-api.s3.us-east-2.com/audio-pronunciations/audioId.mp3';
    const req = requestFixture({
      body: { audioUrl },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    const base64 = 'base64';
    // @ts-expect-error
    fetchBase64Data.mockResolvedValue(base64);
    // @ts-expect-error
    axios.request.mockResolvedValue({});
    await getTranscription(req, res, next);
    expect(axios.request).not.toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://speech.igboapi.com/audio',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { base64 },
    });
    expect(axios.request).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://speech.igboapi.com/predict',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { id: 'audioId', url: audioUrl },
    });
  });

  it('throws error due to non-public audio url', () => {
    const req = requestFixture({ body: { audioUrl: 'audioUrl' } });
    const res = responseFixture();
    const next = nextFunctionFixture();
    getTranscription(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
