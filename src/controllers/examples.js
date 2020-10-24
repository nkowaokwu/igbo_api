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

/* Call the createExample helper function and returns status to client */
export const postExample = async (req, res) => {
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
    return createExample(data)
      .then((example) => {
        updateDocumentMerge(exampleSuggestion, example.id);
        res.send({ id: example.id });
      })
      .catch(() => {
        res.status(400);
        return res.send({ error: 'An error occurred while saving the new example.' });
      });
  } catch {
    res.send(400);
    return res.send({ error: 'An error has occurred during the example creation process.' });
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
