import { statSchema } from '../models/Stat';
import { developerSchema } from '../models/Developer';
import { searchForAllDevelopers } from './utils/queries';
import { createDbConnection, handleCloseConnection } from '../services/database';
import StatTypes from '../shared/constants/StatTypes';

export const getStats = async (_, res, next) => {
  const connection = createDbConnection();
  const Stat = connection.model('Stat', statSchema);
  const Developer = connection.model('Developer', developerSchema);
  try {
    const totalWords = Stat.findOne({ type: StatTypes.SUFFICIENT_WORDS });
    const totalExamples = Stat.findOne({ type: StatTypes.SUFFICIENT_EXAMPLES });
    const totalAudioPronunciations = Stat.findOne({ type: StatTypes.HEADWORD_AUDIO_PRONUNCIATIONS });
    const totalStandardIgboWords = Stat.findOne({ type: StatTypes.STANDARD_IGBO });
    const totalNsibidiWords = Stat.findOne({ type: StatTypes.NSIBIDI_WORDS });
    const totalDevelopers = await Developer.find(searchForAllDevelopers());
    await handleCloseConnection(connection);
    return res.send({
      totalWords,
      totalExamples,
      totalAudioPronunciations: totalAudioPronunciations.length,
      totalStandardIgboWords: totalStandardIgboWords.length,
      totalNsibidiWords: totalNsibidiWords.length,
      totalDevelopers: totalDevelopers.length,
    });
  } catch (err) {
    await handleCloseConnection(connection);
    return next(err);
  }
};
