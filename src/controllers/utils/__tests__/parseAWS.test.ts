import { parseAWSIdFromKey, parseAWSIdFromUri } from '../parseAWS';

describe('parseAWS', () => {
  it('parses out audio Id from AWS Key', () => {
    const res = parseAWSIdFromKey('audio-pronunciations/audioId.mp3');
    expect(res).toEqual('audioId');
  });

  it('does not parse out audio Id correctly for AWS Key', () => {
    const res = parseAWSIdFromKey(
      'https://igbo-api.s3.us-east-2.com/audio-pronunciations/audioId.mp3'
    );
    expect(res).not.toEqual('audioId');
  });

  it('parses out audio Id from AWS URI', () => {
    const res = parseAWSIdFromUri(
      'https://igbo-api.s3.us-east-2.com/audio-pronunciations/audioId.mp3'
    );
    expect(res).toEqual('audioId');
  });

  it('does not parse out audio Id correctly for AWS URI', () => {
    try {
      parseAWSIdFromUri('audio-pronunciations/audioId.mp3');
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
