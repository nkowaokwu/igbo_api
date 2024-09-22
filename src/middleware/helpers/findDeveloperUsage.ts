import { developerUsageSchema } from '../../models/DeveloperUsage';
import { createDbConnection } from '../../services/database';
import ApiType from '../../shared/constants/ApiType';
import { DeveloperUsageDocument } from '../../types/developerUsage';

/* Finds developer's usage for a part of the API */
export const findDeveloperUsage = async ({
  developerId,
  usageType,
}: {
  developerId: string,
  usageType: ApiType,
}): Promise<DeveloperUsageDocument | undefined> => {
  const connection = createDbConnection();
  const DeveloperUsage = connection.model<DeveloperUsageDocument>(
    'DeveloperUsage',
    developerUsageSchema
  );
  const developerUsage = await DeveloperUsage.findOne({ developerId, usageType });
  if (developerUsage) {
    return developerUsage;
  }

  return undefined;
};
