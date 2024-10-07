import { compareSync } from 'bcrypt';
import { developerSchema } from '../../models/Developer';
import { createDbConnection } from '../../services/database';
import { DeveloperDocument } from '../../types';

/* Finds a developer with provided information */
export const findDeveloper = async (apiKey: string) => {
  const connection = createDbConnection();
  const Developer = connection.model<DeveloperDocument>('Developer', developerSchema);
  let developer = await Developer.findOne({ apiKey });
  if (developer) {
    return developer;
  }
  // Legacy implementation: hashed API tokens can't be indexed
  // This logic attempts to find the developer document and update it
  // with the API token
  const developers = await Developer.find({});
  developer = developers.find((dev) => compareSync(apiKey, dev.apiKey)) || null;
  if (developer) {
    developer.apiKey = apiKey;
    const updatedDeveloper = await developer.save();
    return updatedDeveloper;
  }
  return developer;
};
