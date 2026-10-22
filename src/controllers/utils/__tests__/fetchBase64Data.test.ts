import { fetchBase64Data } from '../fetchBase64Data';

const mockFetch = (bytes: Uint8Array) =>
  jest.spyOn(global, 'fetch').mockResolvedValue({
    arrayBuffer: async () => bytes.buffer,
  } as Response);

describe('fetchBase64Data', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the base64 string of the fetched audio', async () => {
    mockFetch(new TextEncoder().encode('hello'));
    const base64 = await fetchBase64Data('https://igboapi.com/audio.mp3');
    expect(global.fetch).toHaveBeenCalledWith('https://igboapi.com/audio.mp3');
    expect(base64).toEqual('aGVsbG8=');
  });

  it('handles audio files the size of a real recording', async () => {
    // ~500KB is about 30 seconds of MP3 audio
    const bytes = new Uint8Array(500 * 1024).map((_, index) => index % 256);
    mockFetch(bytes);
    const base64 = await fetchBase64Data('https://igboapi.com/audio.mp3');
    expect(Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))).toEqual(bytes);
  });
});
