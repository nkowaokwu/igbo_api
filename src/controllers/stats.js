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
      totalStandardIgboWords,
      totalNsibidiWords,
      totalDevelopers,
      totalExamples,
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
    await handleCloseConnection(connection);
    return res.send(stats);
  } catch (err) {
    await handleCloseConnection(connection);
    return next(err);
  }
};
