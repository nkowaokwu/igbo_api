import { fetchAPIKey, findDeveloper } from '../shared/constants/DeveloperUtils';

export default async (req, res, next) => {
  // const { apiLimit } = req.query;
  const apiKey = fetchAPIKey();

  const developer = await findDeveloper(apiKey);
};
