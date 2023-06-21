import { NextFunction, Request, Response } from 'express';
import map from 'lodash/map';
import mongoose, { Connection } from 'mongoose';
import { handleWordFlags } from '../APIs/FlagsAPI';
import { wordSchema } from '../models/Word';
import { findSearchWord } from '../services/words';
import { NO_PROVIDED_TERM } from '../shared/constants/errorMessages';
import createRegExp from '../shared/utils/createRegExp';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import removePrefix from '../shared/utils/removePrefix';
import { createExample } from './examples';
import { IgboAPIRequest, handleQueries, packageResponse } from './utils';
import { findWordsWithMatch } from './utils/buildDocs';
import minimizeWords from './utils/minimizeWords';
import searchWordUsingEnglish from './utils/searchWordUsingEnglish';
import searchWordUsingIgbo from './utils/searchWordUsingIgbo';

/* Gets words from JSON dictionary */
export const getWordData = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyword } = req.query;
    const searchWord = removePrefix(keyword);

    if (!searchWord) {
      throw new Error(NO_PROVIDED_TERM);
    }
    const { wordReg: regexWord } = createRegExp(searchWord);

    return res.send(findSearchWord(regexWord, searchWord));
  } catch (err) {
    return next(err);
  }
};

/* Reuseable base controller function for getting words */
const getWordsFromDatabase = async (req: IgboAPIRequest, res: Response, next: NextFunction) => {
  try {
    // eslint-disable-next-line no-console
    console.time('Getting words from database');
    const {
      version,
      searchWord,
      keywords,
      regex,
      skip,
      limit,
      strict,
      flags,
      filters,
      hasQuotes,
      isUsingMainKey,
      redisClient,
    } = await handleQueries(req);

    const searchQueries = {
      searchWord,
      skip,
      limit,
      flags,
      filters,
    };

    let responseData: { words?: string[]; contentLength?: number } = {};
    if (hasQuotes) {
      responseData = await searchWordUsingEnglish({
        redisClient,
        version,
        regex,
        ...searchQueries,
      });
    } else {
      responseData = await searchWordUsingIgbo({
        redisClient,
        keywords,
        version,
        regex,
        strict,
        isUsingMainKey,
        ...searchQueries,
      });
    }

    // eslint-disable-next-line no-console
    console.log(`Number of words for search word "${searchWord}": ${responseData.contentLength}`);
    // eslint-disable-next-line no-console
    console.timeEnd('Getting words from database');

    return packageResponse({
      res,
      docs: responseData.words,
      contentLength: responseData.contentLength,
      version,
    });
  } catch (err) {
    return next(err);
  }
};
/* Gets words from MongoDB */
export const getWords = async (req: IgboAPIRequest, res: Response, next: NextFunction) => {
  try {
    return await getWordsFromDatabase(req, res, next);
  } catch (err) {
    return next(err);
  }
};

/* Returns a word from MongoDB using an id */
export const getWord = async (req: IgboAPIRequest, res: Response, next: NextFunction) => {
  try {
    const { id, flags, version } = await handleQueries(req);

    const data = await findWordsWithMatch({
      match: { _id: new mongoose.Types.ObjectId(id) },
      version,
    });

    if (!data.words[0]) {
      throw new Error('No word exists with the provided id.');
    }
    const { words } = handleWordFlags({ data, flags });
    const minimizedWords = minimizeWords(words, version);
    const updatedWord = minimizedWords[0];

    return packageResponse({
      res,
      docs: updatedWord,
      contentLength: 1,
      version,
    });
  } catch (err) {
    return next(err);
  }
};

/* Creates Word documents in MongoDB database for testing */
export const createWord = async (data: Record<string, any>, connection: Connection) => {
  const Word = connection.model('Word', wordSchema);
  const { examples, word, wordClass, definitions, variations, stems, dialects, ...rest } = data;

  const wordData = {
    word,
    wordClass,
    definitions,
    variations,
    stems,
    dialects,
    ...rest,
  };

  const newWord = new Word(wordData);
  await newWord.save();

  /* Go through each word's example and create an Example document */
  const savedExamples = map(examples, async (example) => {
    const exampleData = {
      ...example,
      associatedWords: [newWord.id],
    };
    const createdExample = await createExample(exampleData, connection);
    return createdExample;
  });

  /* Wait for all the Examples to be created and then add them to the Word document */
  const resolvedExamples = await Promise.all(savedExamples);
  const exampleIds = getDocumentsIds(resolvedExamples);
  (newWord as any).examples = exampleIds;
  return newWord.save();
};
