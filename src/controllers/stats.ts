import { statSchema } from '../models/Stat';
import { developerSchema } from '../models/Developer';
import { searchForAllDevelopers } from './utils/queries';
import { createDbConnection, handleCloseConnection } from '../services/database';
import StatTypes from '../shared/constants/StatTypes';
import { MiddleWare, Stat as StatType, Developer as DeveloperType } from '../types';

const DEFAULT_STAT = {
  value: 0,
  authorId: 'SYSTEM',
};
const DEFAULT_LENGTH: DeveloperType[] = [];

export const getStats: MiddleWare = async (_, res, next) => {
  const connection = createDbConnection();
  const Stat = connection.model<StatType>('Stat', statSchema);
  const Developer = connection.model<DeveloperType>('Developer', developerSchema);
  try {
    const [
      totalWords = DEFAULT_STAT,
      totalAudioPronunciations = DEFAULT_STAT,
      totalNsibidiWords = DEFAULT_STAT,
      totalDevelopers = DEFAULT_LENGTH,
      totalExamples = DEFAULT_STAT,
      totalIgboDefinitions = DEFAULT_STAT,
      totalProverbs = DEFAULT_STAT,
      totalBibleVerses = DEFAULT_STAT,
    ] = await Promise.all([
      Stat.findOne({ type: StatTypes.SUFFICIENT_WORDS }),
      Stat.findOne({ type: StatTypes.HEADWORD_AUDIO_PRONUNCIATIONS }),
      Stat.findOne({ type: StatTypes.NSIBIDI_WORDS }),
      Developer.find(searchForAllDevelopers()),
      Stat.findOne({ type: StatTypes.SUFFICIENT_EXAMPLES }),
      Stat.findOne({ type: StatTypes.IGBO_DEFINITIONS }),
      Stat.findOne({ type: StatTypes.PROVERB_EXAMPLES }),
      Stat.findOne({ type: StatTypes.BIBLICAL_EXAMPLES }),
    ]);
    const stats = {
      totalWords: (totalWords || DEFAULT_STAT).value,
      totalExamples: (totalExamples || DEFAULT_STAT).value,
      totalAudioPronunciations: (totalAudioPronunciations || DEFAULT_STAT).value,
      totalNsibidiWords: (totalNsibidiWords || DEFAULT_STAT).value,
      totalDevelopers: (totalDevelopers || DEFAULT_LENGTH).length,
      totalIgboDefinitions: (totalIgboDefinitions || DEFAULT_STAT).value,
      totalProverbs: (totalProverbs || DEFAULT_STAT).value,
      totalBibleVerses: (totalBibleVerses || DEFAULT_STAT).value,
    };
    await handleCloseConnection(connection);
    return res.send(stats);
  } catch (err: any) {
    await handleCloseConnection(connection);
    return next(err);
  }
};
