import { Types } from 'mongoose';
import { findDeveloperUsage } from './findDeveloperUsage';
import { createDeveloperUsage } from './createDeveloperUsage';
import { DeveloperUsageDocument } from '../../types/developerUsage';
import ApiType from '../../shared/constants/ApiType';
import ApiUsageLimit from '../../shared/constants/ApiUsageLimit';
import { DeveloperDocument } from '../../types';

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
}): Promise<DeveloperUsageDocument> => {
  const currentDate = new Date();
  let developerUsage = await findDeveloperUsage({
    developerId: developer.id.toString(),
    usageType: apiType,
  });

  if (!developerUsage && apiType === ApiType.DICTIONARY) {
    developerUsage = await createDeveloperUsage({
      developerId: new Types.ObjectId(developer.id.toString()),
    });
  }

  if (!developerUsage) {
    throw new Error('No developer usage found');
  }

  if (developerUsage.usage.count >= ApiUsageLimit[apiType]) {
    throw new Error('You have exceeded your limit for this API for the day.');
  }

  const isNewDay = !isSameDate(developerUsage.usage.date, currentDate);
  developerUsage.usage.count = isNewDay ? 0 : developerUsage.usage.count + 1;
  developerUsage.usage.date = currentDate;

  developerUsage.markModified('usage');

  return developerUsage.save();
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
}) =>
  handleDeveloperUsage({
    developer,
    apiType: route.startsWith('speech-to-text') ? ApiType.SPEECH_TO_TEXT : ApiType.DICTIONARY,
  });
