import { compareSync } from 'bcrypt';
import { developerSchema } from '../../models/Developer';
import { createDbConnection } from '../../services/database';
import { DeveloperDocument, MiddleWare } from '../../types';

export const handleRequest: MiddleWare = (req) => {
  const { apiLimit } = req.query;
  const apiToken = req.headers['X-API-Key'] || req.headers['x-api-key'];

  return { apiLimit, apiToken };
};

/* Finds a developer with provided information */
export const findDeveloper = async (apiKey: string) => {
  console.time('Finding developer account');
  const connection = createDbConnection();
  const Developer = connection.model<DeveloperDocument>('Developer', developerSchema);
  let developer = await Developer.findOne({ apiKey });
  if (developer) {
    console.timeEnd('Finding developer account');
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
    console.timeEnd('Finding developer account');
    return updatedDeveloper;
  }
  console.timeEnd('Finding developer account');
  return developer;
};
