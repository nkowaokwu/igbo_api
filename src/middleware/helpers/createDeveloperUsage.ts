import { Types } from 'mongoose';
import { developerUsageSchema } from '../../models/DeveloperUsage';
import { createDbConnection } from '../../services/database';
import ApiType from '../../shared/constants/ApiType';
import { DeveloperUsageDocument } from '../../types';

/* Creates a fallback Developer Usage document */
export const createDeveloperUsage = async ({ developerId }: { developerId: Types.ObjectId }) => {
  const connection = createDbConnection();
  const DeveloperUsage = connection.model<DeveloperUsageDocument>(
    'DeveloperUsage',
    developerUsageSchema
  );
  const developerUsage = new DeveloperUsage({ developerId, usageType: ApiType.DICTIONARY });
  return developerUsage.save();
};
