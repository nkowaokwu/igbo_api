import { Types } from 'mongoose';
import { findDeveloperUsage } from './findDeveloperUsage';
import { createDeveloperUsage } from './createDeveloperUsage';
import { DeveloperUsageDocument } from '../../types/developerUsage';
import ApiType from '../../shared/constants/ApiType';
import ApiTypeToRoute from '../../shared/constants/ApiTypeToRoute';
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
  path,
  developer,
}: {
  path: string,
  developer: DeveloperDocument,
}) => {
  const extractedPath = getPath(path);
  return handleDeveloperUsage({
    developer,
    apiType: getApiTypeFromRoute(extractedPath),
  });
};

/**
 * The function maps route strings to the APIType Enum that would represent usage
 * of the route
 * @param route The string name of the route
 * @returns The ApiType of the route passed as input. For example /speech-to-text would
 *          route to the Speech-to-Text API type
 */
const getApiTypeFromRoute = (route: string): ApiType => {
  switch (route) {
    case ApiTypeToRoute.SPEECH_TO_TEXT:
      return ApiType.SPEECH_TO_TEXT;
    case ApiTypeToRoute.TRANSLATE:
      return ApiType.TRANSLATE;
    default:
      return ApiType.DICTIONARY;
  }
};

const getPath = (path: string) => {
  // Extract router path from full path
  // ex. speech-to-text/params=param -> speech-to-text
  return path.split(/[\/\?]/)[0];
};
