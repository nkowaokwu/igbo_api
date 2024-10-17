import axios from 'axios';
import {
  requestFixture,
  responseFixture,
  nextFunctionFixture,
} from '../../__tests__/shared/fixtures';
import { getTranscription } from '../speechToText';
import { fetchBase64Data } from '../utils/fetchBase64Data';

jest.mock('axios');
jest.mock('../utils/fetchBase64Data');

describe('speechToText', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('calls audio IgboSpeech audio endpoint to upload audio with url', async () => {
    const req = requestFixture({ body: { audioUrl: 'https://igboapi.com' } });
    const res = responseFixture();
    const next = nextFunctionFixture();
    const base64 = 'base64';
    // @ts-expect-error resolving value
    fetchBase64Data.mockResolvedValue(base64);
    jest.spyOn(axios, 'request').mockResolvedValue({
      data: { audioId: 'audioId', audioUrl: 'https://igboapi.com' },
    });
    await getTranscription(req, res, next);
    // @ts-expect-error non-existing value
    expect(axios.request.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      url: 'http://localhost:3333/audio',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'main_key',
      },
      data: { base64 },
    });
    // @ts-expect-error non-existing value
    expect(axios.request.mock.calls[1][0]).toMatchObject({
      method: 'POST',
      url: 'http://localhost:3333/predict',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'main_key',
      },
      data: { id: 'audioId', url: 'https://igboapi.com' },
    });
  });

  it('calls audio IgboSpeech audio endpoint to upload audio with base64', async () => {
    const base64 = 'data:audio';
    const req = requestFixture({ body: { audioUrl: base64 } });
    const res = responseFixture();
    const next = nextFunctionFixture();
    // @ts-expect-error resolved value
    fetchBase64Data.mockResolvedValue(base64);
    jest.spyOn(axios, 'request').mockResolvedValue({
      data: { audioId: 'audioId', audioUrl: 'https://igboapi.com' },
    });
    await getTranscription(req, res, next);
    // @ts-expect-error non-existing value
    expect(axios.request.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      url: 'http://localhost:3333/audio',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'main_key',
      },
      data: { base64 },
    });
    // @ts-expect-error non-existing value
    expect(axios.request.mock.calls[1][0]).toMatchObject({
      method: 'POST',
      url: 'http://localhost:3333/predict',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'main_key',
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
    // @ts-expect-error resolved value
    fetchBase64Data.mockResolvedValue(base64);
    jest.spyOn(axios, 'request').mockResolvedValue({});
    await getTranscription(req, res, next);
    expect(axios.request).not.toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:3333/audio',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'main_key',
      },
      data: { base64 },
    });
    expect(axios.request).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:3333/predict',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'main_key',
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
