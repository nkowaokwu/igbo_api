import { map } from 'lodash';
import Phrase from '../models/Phrase';
import { createExample } from './examples';
import { getDocumentsIds } from '../shared/utils/documentUtils';
import { POPULATE_EXAMPLE } from '../shared/constants/populateDocuments';

/* Searches for a phrase with Igbo stored in MongoDB */
export const searchPhraseUsingIgbo = (regex) => (
  Phrase
    .find({ phrase: { $in: [regex] } })
    .populate(POPULATE_EXAMPLE)
);

/* Searches for a phrase with English stored in MongoDB */
export const searchPhraseUsingEnglish = (regex) => (
  Phrase
    .find({ definitions: { $in: [regex] } })
    .populate(POPULATE_EXAMPLE)
);

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
