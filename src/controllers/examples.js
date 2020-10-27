import mongoose from 'mongoose';
import {
  assign,
  some,
  map,
  trim,
} from 'lodash';
import Example from '../models/Example';
import { prepResponse, handleQueries, updateDocumentMerge } from './utils';
import { findExampleSuggestionById } from './exampleSuggestions';

/* Create a new Example object in MongoDB */
export const createExample = (data) => {
  const example = new Example(data);
  return example.save();
};

/* Uses regex to search for examples with both Igbo and English */
const searchExamples = (regex) => (
  Example
    .find({ $or: [{ igbo: regex }, { english: regex }] })
);

/* Returns examples from MongoDB */
export const getExamples = async (req, res) => {
  const { regexKeyword, page, sort } = handleQueries(req.query);
  const examples = await searchExamples(regexKeyword);

  return prepResponse(res, examples, page, sort);
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
const mergeIntoExample = ({ data, exampleSuggestion }) => (
  findExampleById(data.id)
    .then((example) => {
      if (!example) {
        throw new Error('Example doesn\'t exist');
      }
      const updatedExample = assign(example, data);
      if (exampleSuggestion) {
        updateDocumentMerge(exampleSuggestion, example.id);
      }
      return updatedExample.save();
    })
    .catch(() => {
      throw new Error('An error occurred while merging into an existing example.');
    })
);

/* Creates a new Example document from an existing ExampleSuggestion document */
const createExampleFromSuggestion = ({ data, exampleSuggestion }) => (
  createExample(data)
    .then((example) => {
      if (exampleSuggestion) {
        updateDocumentMerge(exampleSuggestion, example.id);
      }
      return { id: example.id };
    })
    .catch(() => {
      throw new Error('An error occurred while saving the new example.');
    })
);

/* Merges the existing ExampleSuggestion into either a brand
 * new Example document or merges into an existing Example document */
export const mergeExample = async (req, res) => {
  const { body: data } = req;

  if (!data.igbo && !data.english) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  if (some(data.associatedWords, (associatedWord) => !mongoose.Types.ObjectId.isValid(associatedWord))) {
    res.status(400);
    return res.send({ error: 'Invalid id found in associatedWords' });
  }

  if (!data.id) {
    res.status(400);
    return res.send({ error: 'The id property is missing, double check your provided data' });
  }

  const exampleSuggestion = await findExampleSuggestionById(data.id);

  if (!exampleSuggestion) {
    res.status(400);
    return res.send({
      error: 'There is no associated example suggestion, double check your provided data',
    });
  }

  try {
    if (data.originalExampleId) {
      return res.send(mergeIntoExample({ data, exampleSuggestion }));
    }
    return res.send(createExampleFromSuggestion({ data, exampleSuggestion }));
  } catch (error) {
    res.send(400);
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
