import mongoose from 'mongoose';
import {
  assign,
  some,
  map,
  trim,
  uniq,
} from 'lodash';
import Example from '../models/Example';
import Word from '../models/Word';
import SuggestionTypes from '../shared/constants/suggestionTypes';
import { DICTIONARY_APP_URL } from '../config';
import { packageResponse, handleQueries, updateDocumentMerge } from './utils';
import { searchExamplesRegexQuery } from './utils/queries';
import { findExampleSuggestionById } from './exampleSuggestions';
import { sendMergedEmail } from './mail';

/* Create a new Example object in MongoDB */
export const createExample = (data) => {
  const example = new Example(data);
  return example.save();
};

/* Uses regex to search for examples with both Igbo and English */
const searchExamples = ({ query, skip, limit }) => (
  Example
    .find(query)
    .skip(skip)
    .limit(limit)
);

/* Returns examples from MongoDB */
export const getExamples = async (req, res) => {
  try {
    const {
      regexKeyword,
      skip,
      limit,
      ...rest
    } = handleQueries(req.query);
    const regexMatch = searchExamplesRegexQuery(regexKeyword);
    const examples = await searchExamples({ query: regexMatch, skip, limit });

    return packageResponse({
      res,
      docs: examples,
      model: Example,
      query: regexMatch,
      ...rest,
    });
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
};

export const findExampleById = (id) => (
  Example.findById(id)
);

/* Returns an example from MongoDB using an id */
export const getExample = (req, res) => {
  const { id } = req.params;
  return findExampleById(id)
    .then((example) => {
      if (!example) {
        res.status(400);
        return res.send({ error: 'No example exists with the provided id.' });
      }
      return res.send(example);
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while return a single example.' });
    });
};

/* Merges new data into an existing Example document */
const mergeIntoExample = (exampleSuggestion, mergedBy) => (
  Example.findOneAndUpdate({ _id: exampleSuggestion.originalExampleId }, exampleSuggestion.toObject())
    .then(async (example) => {
      if (!example) {
        throw new Error('Example doesn\'t exist');
      }
      await updateDocumentMerge(exampleSuggestion, example.id, mergedBy);
      return example;
    })
);

/* Creates a new Example document from an existing ExampleSuggestion document */
const createExampleFromSuggestion = (exampleSuggestion, mergedBy) => (
  createExample(exampleSuggestion.toObject())
    .then(async (example) => {
      await updateDocumentMerge(exampleSuggestion, example.id, mergedBy);
      return example;
    })
    .catch(() => {
      throw new Error('An error occurred while saving the new example.');
    })
);

/* Executes the logic describe the mergeExample function description */
export const executeMergeExample = async (exampleSuggestionId, mergedBy) => {
  const exampleSuggestion = await findExampleSuggestionById(exampleSuggestionId);

  if (!exampleSuggestion) {
    throw new Error('There is no associated example suggestion, double check your provided data');
  }

  if (!exampleSuggestion.igbo && !exampleSuggestion.english) {
    throw new Error('Required information is missing, double check your provided data');
  }

  if (some(exampleSuggestion.associatedWords, (associatedWord) => !mongoose.Types.ObjectId.isValid(associatedWord))) {
    throw new Error('Invalid id found in associatedWords');
  }

  await Promise.all(
    map(exampleSuggestion.associatedWords, async (associatedWordId) => {
      if (!(await Word.findById(associatedWordId))) {
        throw new Error('Example suggestion associated words can only contain Word ids before merging');
      }
    }),
  );

  if (exampleSuggestion.associatedWords.length !== uniq(exampleSuggestion.associatedWords).length) {
    throw new Error('Duplicates are not allows in associated words');
  }

  return exampleSuggestion.originalExampleId
    ? mergeIntoExample(exampleSuggestion, mergedBy)
    : createExampleFromSuggestion(exampleSuggestion, mergedBy);
};

/* Merges the existing ExampleSuggestion into either a brand
 * new Example document or merges into an existing Example document */
export const mergeExample = async (req, res) => {
  const { body: data } = req;

  if (!data.id) {
    res.status(400);
    return res.send({ error: 'The id property is missing, double check your provided data' });
  }

  const exampleSuggestion = await findExampleSuggestionById(data.id);

  try {
    const result = await executeMergeExample(exampleSuggestion.id, data.mergedBy);
    /* Sends confirmation merged email to user if they provided an email */
    if (result.userEmail) {
      const word = await Word.findById(result.associatedWords[0] || null) || {};
      sendMergedEmail({
        to: result.userEmail,
        suggestionType: SuggestionTypes.EXAMPLE,
        submissionLink: `${DICTIONARY_APP_URL}/word?word=${word.word}`,
        ...result,
      });
    }
    return res.send(result);
  } catch (error) {
    res.status(400);
    return res.send({ error: error.message });
  }
};

/* Updates an Example document in the database */
export const putExample = (req, res) => {
  const { body: data, params: { id } } = req;

  if (!data.igbo && !data.english) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  if (!Array.isArray(data.associatedWords)) {
    data.associatedWords = map(data.associatedWords.split(','), (associatedWord) => trim(associatedWord));
  }

  if (some(data.associatedWords, (associatedWord) => !mongoose.Types.ObjectId.isValid(associatedWord))) {
    res.status(400);
    return res.send({ error: 'Invalid id found in associatedWords' });
  }

  if (data.associatedWords && data.associatedWords.length !== uniq(data.associatedWords).length) {
    res.status(400);
    return res.send({ error: 'Duplicates are not allows in associated words' });
  }

  return findExampleById(id)
    .then(async (example) => {
      if (!example) {
        res.status(400);
        return res.send({ error: 'Example doesn\'t exist' });
      }
      const updatedExample = assign(example, data);
      return res.send(await updatedExample.save());
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while updating the example, double check your provided data.' });
    });
};
