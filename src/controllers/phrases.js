import { map } from 'lodash';
import Phrase from '../models/Phrase';
import removePrefix from '../shared/utils/removePrefix';
import { createQueryRegex, sortDocsByDefinitions } from './utils';
import { createExample } from './examples';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import { POPULATE_EXAMPLE } from '../shared/constants/populateDocuments';

/* Searches for a phrase with Igbo stored in MongoDB */
export const searchPhraseUsingIgbo = (regex, page = -1) => (
  page === -1 ? (
    Phrase
      .find({ phrase: { $in: [regex] } })
      .populate(POPULATE_EXAMPLE)
  ) : (
    Phrase
      .find({ phrase: { $in: [regex] } })
      .populate(POPULATE_EXAMPLE)
      .limit(10)
      .skip(page)
  )
);

/* Searches for a phrase with English stored in MongoDB */
export const searchPhraseUsingEnglish = (regex, page = -1) => (
  page === -1 ? (
    Phrase
      .find({ definitions: { $in: [regex] } })
      .populate(POPULATE_EXAMPLE)
  ) : (
    Phrase
      .find({ definitions: { $in: [regex] } })
      .populate(POPULATE_EXAMPLE)
      .limit(10)
      .skip(page)
  )
);

const getPhrasesUsingEnglish = async (res, searchPhrase) => {
  const sortedPhrases = sortDocsByDefinitions(searchPhrase, await searchPhraseUsingEnglish(searchPhrase));
  return res.send(sortedPhrases);
};

/* Gets phrases from MongoDB */
export const getPhrases = async (req, res) => {
  const { keyword = '', page: pageQuery } = req.query;
  const searchPhrase = removePrefix(keyword);
  const page = parseInt(pageQuery, 10) || 0;
  const regexPhrase = createQueryRegex(searchPhrase);
  const phrases = await searchPhraseUsingIgbo(regexPhrase, page);

  if (!phrases.length) {
    return getPhrasesUsingEnglish(res, regexPhrase, page);
  }
  return res.send(phrases);
};

/* Creates Phrase documents in MongoDB database */
export const createPhrase = async (data) => {
  const {
    examples,
    phrase,
    word: parentWord,
    definitions,
  } = data;
  const phraseData = {
    phrase,
    parentWord,
    definitions,
  };
  const newPhrase = new Phrase(phraseData);
  await newPhrase.save();

  /* Go through each phrase's example and create a Example document */
  const savedExamples = map(examples, (example) => {
    const exampleData = {
      example,
      parentPhrase: newPhrase.id,
      parentWord: data.word,
    };
    return createExample(exampleData);
  });

  /* Wait for all the Examples to be created and then add them to the Phrase document */
  return Promise.all(savedExamples).then((res) => {
    const ids = getDocumentsIds(res);
    newPhrase.examples = ids;
    return newPhrase.save();
  });
};
