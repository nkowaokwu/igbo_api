import { DeveloperDocument } from '../../types';

enum ApiType {
  IGBO = 'IGBO',
  SPEECH_TO_TEXT = 'SPEECH_TO_TEXT',
}

const PROD_IGBO_API_LIMIT = 2500;
const PROD_SPEECH_TO_TEXT_LIMIT = 20;

const isSameDate = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

/* Increments usage count and updates usage date */
const handleDeveloperUsage = async ({
  developer,
  apiType,
}: {
  developer: DeveloperDocument,
  apiType: ApiType,
}) => {
  const updatedDeveloper = developer;
  if (!updatedDeveloper) {
    throw new Error('No developer found');
  }
  const isNewDay = !isSameDate(updatedDeveloper.usage.date, new Date());
  updatedDeveloper.usage.date = new Date();

  switch (apiType) {
    case ApiType.IGBO:
      updatedDeveloper.usage.count = isNewDay ? 0 : updatedDeveloper.usage.count + 1;
      break;
    case ApiType.SPEECH_TO_TEXT:
      updatedDeveloper.speechToTextUsage.count = isNewDay
        ? 0
        : updatedDeveloper.speechToTextUsage.count + 1;
      break;
    default:
      break;
  }

  return updatedDeveloper.save();
};

/**
 * Authorizes the developer to use the current route if they are under their daily limit.
 * @param param0
 */
export const authorizeDeveloperUsage = async ({
  route,
  developer,
}: {
  route: string,
  developer: DeveloperDocument,
}) => {
  if (route.startsWith('speech-to-text')) {
    if (developer.speechToTextUsage.count >= PROD_SPEECH_TO_TEXT_LIMIT) {
      throw new Error('You have exceeded your limit of Igbo API requests for the day.');
    }
    handleDeveloperUsage({ developer, apiType: ApiType.IGBO });
  } else {
    if (developer.usage.count >= PROD_IGBO_API_LIMIT) {
      throw new Error('You have exceeded your Speech-to-Text requests for the day.');
    }
    handleDeveloperUsage({ developer, apiType: ApiType.SPEECH_TO_TEXT });
  }
};
