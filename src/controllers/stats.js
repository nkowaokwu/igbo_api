import Word from '../models/Word';
import Example from '../models/Example';
import {
  searchForAllWordsWithAudioPronunciations,
  searchForAllWordsWithIsStandardIgbo,
  searchForAllWordsWithNsibidi,
} from './utils/queries';

export const getStats = async (_, res, next) => {
  try {
    const totalWords = await Word.countDocuments();
    const totalExamples = await Example.countDocuments();
    const totalAudioPronunciations = await Word.find(searchForAllWordsWithAudioPronunciations());
    const totalStandardIgboWords = await Word.find(searchForAllWordsWithIsStandardIgbo());
    const totalNsibidiWords = await Word.find(searchForAllWordsWithNsibidi());
    return res.send({
      totalWords,
      totalExamples,
      totalAudioPronunciations: totalAudioPronunciations.length,
      totalStandardIgboWords: totalStandardIgboWords.length,
      totalNsibidiWords: totalNsibidiWords.length,
    });
  } catch (err) {
    return next(err);
  }
};
