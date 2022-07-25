import Word from '../models/Word';
import Example from '../models/Example';
import Developer from '../models/Developer';
import {
  searchForAllWordsWithAudioPronunciations,
  searchForAllWordsWithIsStandardIgbo,
  searchForAllWordsWithNsibidi,
  searchForAllDevelopers,
} from './utils/queries';

export const getStats = async (_, res, next) => {
  try {
    const totalWords = await Word.countDocuments();
    const totalExamples = await Example.countDocuments();
    const totalAudioPronunciations = await Word.find(searchForAllWordsWithAudioPronunciations());
    const totalStandardIgboWords = await Word.find(searchForAllWordsWithIsStandardIgbo());
    const totalNsibidiWords = await Word.find(searchForAllWordsWithNsibidi());
    const totalDevelopers = await Developer.find(searchForAllDevelopers());
    return res.send({
      totalWords,
      totalExamples,
      totalAudioPronunciations: totalAudioPronunciations.length,
      totalStandardIgboWords: totalStandardIgboWords.length,
      totalNsibidiWords: totalNsibidiWords.length,
      totalDevelopers: totalDevelopers.length,
    });
  } catch (err) {
    return next(err);
  }
};
