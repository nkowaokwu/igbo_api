import { statSchema } from '../models/Stat';
import { developerSchema } from '../models/Developer';
import { searchForAllDevelopers } from './utils/queries';
import { createDbConnection, handleCloseConnection } from '../services/database';
import StatTypes from '../shared/constants/StatTypes';

export const getStats = async (req, res, next) => {
  const connection = createDbConnection();
  const Stat = connection.model('Stat', statSchema);
  const Developer = connection.model('Developer', developerSchema);
  try {
    const [
      totalWords,
      totalAudioPronunciations,
      totalNsibidiWords,
      totalDevelopers,
      totalExamples,
      totalIgboDefinitions,
      totalProverbs,
    ] = await Promise.all([
      Stat.findOne({ type: StatTypes.SUFFICIENT_WORDS }),
      Stat.findOne({ type: StatTypes.HEADWORD_AUDIO_PRONUNCIATIONS }),
      Stat.findOne({ type: StatTypes.NSIBIDI_WORDS }),
      Developer.find(searchForAllDevelopers()),
      Stat.findOne({ type: StatTypes.SUFFICIENT_EXAMPLES }),
      Stat.findOne({ type: StatTypes.IGBO_DEFINITIONS }),
      Stat.findOne({ type: StatTypes.PROVERB_EXAMPLES }),
    ]);
    const stats = {
      totalWords: totalWords.value,
      totalExamples: totalExamples.value,
      totalAudioPronunciations: totalAudioPronunciations.value,
      totalNsibidiWords: totalNsibidiWords.value,
      totalDevelopers: totalDevelopers.length,
      totalIgboDefinitions: totalIgboDefinitions.value,
      totalProverbs: totalProverbs.value,
    };
    await handleCloseConnection(connection);
    return res.send(stats);
  } catch (err) {
    await handleCloseConnection(connection);
    return next(err);
  }
};
