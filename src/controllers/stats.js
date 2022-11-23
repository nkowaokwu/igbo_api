import { wordSchema } from '../models/Word';
import { exampleSchema } from '../models/Example';
import Developer from '../models/Developer';
import {
  searchForAllWordsWithAudioPronunciations,
  searchForAllWordsWithIsStandardIgbo,
  searchForAllWordsWithNsibidi,
  searchForAllDevelopers,
} from './utils/queries';
import { createDbConnection, handleCloseConnection } from '../services/database';

export const getStats = async (_, res, next) => {
  const connection = createDbConnection();
  const Word = connection.model('Word', wordSchema);
  const Example = connection.model('Example', exampleSchema);
  try {
    const totalWords = await Word.countDocuments();
    const totalExamples = await Example.countDocuments();
    const totalAudioPronunciations = await Word.find(searchForAllWordsWithAudioPronunciations());
    const totalStandardIgboWords = await Word.find(searchForAllWordsWithIsStandardIgbo());
    const totalNsibidiWords = await Word.find(searchForAllWordsWithNsibidi());
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
