import { statSchema } from '../models/Stat';
import { developerSchema } from '../models/Developer';
import { searchForAllDevelopers } from './utils/queries';
import { createDbConnection, handleCloseConnection } from '../services/database';
import StatTypes from '../shared/constants/StatTypes';
import { handleQueries } from './utils';

export const getStats = async (req, res, next) => {
  const connection = createDbConnection();
  const { redisClient } = await handleQueries(req);
  const Stat = connection.model('Stat', statSchema);
  const Developer = connection.model('Developer', developerSchema);
  const redisStatsCacheKey = 'stats';
  try {
    const cachedStats = await redisClient.get(redisStatsCacheKey);
    if (cachedStats) {
      await handleCloseConnection(connection);
      return res.send(cachedStats);
    }
    const [
      totalWords,
      totalExamples,
      totalAudioPronunciations,
      totalStandardIgboWords,
      totalNsibidiWords,
      totalDevelopers,
    ] = await Promise.all([
      Stat.findOne({ type: StatTypes.SUFFICIENT_WORDS }),
      Stat.findOne({ type: StatTypes.HEADWORD_AUDIO_PRONUNCIATIONS }),
      Stat.findOne({ type: StatTypes.STANDARD_IGBO }),
      Stat.findOne({ type: StatTypes.NSIBIDI_WORDS }),
      Developer.find(searchForAllDevelopers()),
      Stat.findOne({ type: StatTypes.SUFFICIENT_EXAMPLES }),
    ]);
    const stats = {
      totalWords: totalWords.value,
      totalExamples: totalExamples.value,
      totalAudioPronunciations: totalAudioPronunciations.value,
      totalStandardIgboWords: totalStandardIgboWords.value,
      totalNsibidiWords: totalNsibidiWords.value,
      totalDevelopers: totalDevelopers.length,
    };
    if (!redisClient.isFake) {
      redisClient.set(redisStatsCacheKey, JSON.stringify(stats));
    }
    await handleCloseConnection(connection);
    return res.send(stats);
  } catch (err) {
    await handleCloseConnection(connection);
    return next(err);
  }
};
