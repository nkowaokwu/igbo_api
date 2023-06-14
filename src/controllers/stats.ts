import { NextFunction, Request, Response } from 'express';
import { statSchema } from '../models/Stat';
import { developerSchema } from '../models/Developer';
import { searchForAllDevelopers } from './utils/queries';
import { createDbConnection, handleCloseConnection } from '../services/database';
import StatType from '../shared/constants/StatType';
import StatModel from '../models/interfaces/Stat';
import DeveloperModel from '../models/interfaces/Developer';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  const connection = createDbConnection();
  const Stat = connection.model<StatModel>('Stat', statSchema);
  const Developer = connection.model<DeveloperModel>('Developer', developerSchema);
  try {
    const [
      totalWords,
      totalAudioPronunciations,
      totalNsibidiWords,
      totalDevelopers,
      totalExamples,
      totalIgboDefinitions,
      totalProverbs,
      totalBibleVerses,
    ] = await Promise.all([
      Stat.findOne({ type: StatType.SUFFICIENT_WORDS }),
      Stat.findOne({ type: StatType.HEADWORD_AUDIO_PRONUNCIATIONS }),
      Stat.findOne({ type: StatType.NSIBIDI_WORDS }),
      Developer.find(searchForAllDevelopers()),
      Stat.findOne({ type: StatType.SUFFICIENT_EXAMPLES }),
      Stat.findOne({ type: StatType.IGBO_DEFINITIONS }),
      Stat.findOne({ type: StatType.PROVERB_EXAMPLES }),
      Stat.findOne({ type: StatType.BIBLICAL_EXAMPLES }),
    ]);
    const stats = {
      totalWords: totalWords.value,
      totalExamples: totalExamples.value,
      totalAudioPronunciations: totalAudioPronunciations.value,
      totalNsibidiWords: totalNsibidiWords.value,
      totalDevelopers: totalDevelopers.length,
      totalIgboDefinitions: totalIgboDefinitions.value,
      totalProverbs: totalProverbs.value,
      totalBibleVerses: totalBibleVerses.value,
    };
    await handleCloseConnection(connection);
    return res.send(stats);
  } catch (err) {
    await handleCloseConnection(connection);
    return next(err);
  }
};
