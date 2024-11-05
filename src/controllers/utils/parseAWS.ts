const AWS_AUDIO_PRONUNCIATIONS_DELIMITER = '/audio-pronunciations/';

/**
 * Parses out the document Id (typically the ExampleSuggestion) from the AWS Key.
 * (i.e. audio-pronunciations/<audioId>.mp3)
 * @param awsId AWS Key
 * @returns Audio Id
 */
export const parseAWSIdFromKey = (awsId: string) => awsId.split('.')[0].split('/')[1];

/**
 * Parses out the document Id (typically the ExampleSuggestion from the AWS URI).
 * (i.e. https://igbo-api.s3.us-east-2.amazonaws.com/audio-pronunciations/<audioId>.mp3)
 * @param awsUri AWS URI
 * @returns Audio Id
 */
export const parseAWSIdFromUri = (awsUri: string) =>
  awsUri.split(AWS_AUDIO_PRONUNCIATIONS_DELIMITER)[1].split('.')[0];
