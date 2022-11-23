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
    const totalWords = await Stat.findOne({ type: StatTypes.SUFFICIENT_WORDS });
    const totalExamples = await Stat.findOne({ type: StatTypes.SUFFICIENT_EXAMPLES });
    const totalAudioPronunciations = await Stat.findOne({ type: StatTypes.HEADWORD_AUDIO_PRONUNCIATIONS });
    const totalStandardIgboWords = await Stat.findOne({ type: StatTypes.STANDARD_IGBO });
    const totalNsibidiWords = await Stat.findOne({ type: StatTypes.NSIBIDI_WORDS });
    const totalDevelopers = await Developer.find(searchForAllDevelopers());
    await handleCloseConnection(connection);
    return res.send({
      totalWords: totalWords.value,
      totalExamples: totalExamples.value,
      totalAudioPronunciations: totalAudioPronunciations.value,
      totalStandardIgboWords: totalStandardIgboWords.value,
      totalNsibidiWords: totalNsibidiWords.value,
      totalDevelopers: totalDevelopers.length,
    });
  } catch (err) {
    await handleCloseConnection(connection);
    return next(err);
  }
};
