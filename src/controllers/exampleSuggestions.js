import mongoose from 'mongoose';
import { assign, some, map } from 'lodash';
import SuggestionTypes from '../shared/constants/suggestionTypes';
import ExampleSuggestion from '../models/ExampleSuggestion';
import { prepResponse, handleQueries } from './utils';
import { sendRejectedEmail } from './mail';

export const createExampleSuggestion = async (data) => {
  if (!data.igbo && !data.english) {
    throw new Error('Required information is missing, double check your provided data');
  }

  if (some(data.associatedWords, (associatedWord) => !mongoose.Types.ObjectId.isValid(associatedWord))) {
    throw new Error('Invalid id found in associatedWords');
  }

  await Promise.all(map(data.associatedWords, async (associatedWordId) => {
    const identicalExampleSuggestions = await ExampleSuggestion
      .find({})
      .where('igbo').equals(data.igbo)
      .where('english').equals(data.english)
      .where('associatedWords').in(associatedWordId);

    if (identicalExampleSuggestions.length) {
      const exampleSuggestionIds = map(identicalExampleSuggestions, (exampleSuggestion) => exampleSuggestion.id);
      throw new Error(`There is already an existing example suggestion with the exact same information. 
        ExampleSuggestion id(s): ${exampleSuggestionIds}`);
    }
  }));

  const newExampleSuggestion = new ExampleSuggestion(data);
  return newExampleSuggestion.save()
    .catch(() => {
      throw new Error('An error has occurred while saving, double check your provided data');
    });
};

/* Creates a new ExampleSuggestion document in the database */
export const postExampleSuggestion = async (req, res) => {
  const { body: data } = req;

  try {
    const createdExampleSuggestion = createExampleSuggestion(data);
    return res.send(await createdExampleSuggestion);
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
};

export const updateExampleSuggestion = ({ id, data }) => (
  ExampleSuggestion.findById(id)
    .then(async (exampleSuggestion) => {
      if (!exampleSuggestion) {
        throw new Error('Example suggestion doesn\'t exist');
      }
      const updatedExampleSuggestion = assign(exampleSuggestion, data);
      return updatedExampleSuggestion.save();
    })
    .catch((err) => {
      throw new Error(err.message);
    })
);

/* Updates an existing ExampleSuggestion object */
export const putExampleSuggestion = async (req, res) => {
  const { body: data, params: { id } } = req;

  if (!data.igbo && !data.english) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  try {
    const updatedExampleSuggestion = updateExampleSuggestion({ id, data });
    return res.send(await updatedExampleSuggestion);
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
};

/* Returns all existing ExampleSuggestion objects */
export const getExampleSuggestions = (req, res) => {
  const { regexKeyword, ...rest } = handleQueries(req.query);
  return ExampleSuggestion
    .find({ $or: [{ igbo: regexKeyword }, { english: regexKeyword }] })
    .where('exampleForWordSuggestion').equals(false)
    .sort({ approvals: 'desc' })
    .then((exampleSuggestions) => (
      prepResponse({ res, docs: exampleSuggestions, ...rest })
    ))
    .catch(() => {
      res.status(400);
      return res.send('An error has occurred while return example suggestions, double check your provided data');
    });
};

export const findExampleSuggestionById = (id) => (
  ExampleSuggestion.findById(id)
);

/* Returns a single ExampleSuggestion by using an id */
export const getExampleSuggestion = (req, res) => {
  const { id } = req.params;
  return findExampleSuggestionById(id)
    .then((exampleSuggestion) => {
      if (!exampleSuggestion) {
        res.status(400);
        return res.send({ error: 'No example suggestion exists with the provided id.' });
      }
      return res.send(exampleSuggestion);
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while returning a single example suggestion' });
    });
};

export const removeExampleSuggestion = (id) => (
  ExampleSuggestion.findByIdAndDelete(id)
    .then((exampleSuggestion) => {
      if (!exampleSuggestion) {
        throw new Error('No example suggestion exists with the provided id.');
      }
      /* Sends rejection email to user if they provided an email and the exampleSuggestion isn't merged */
      if (exampleSuggestion.userEmail && !exampleSuggestion.merged) {
        sendRejectedEmail({
          to: exampleSuggestion.userEmail,
          suggestionType: SuggestionTypes.WORD,
          ...exampleSuggestion,
        });
      }
      return exampleSuggestion;
    })
    .catch(() => {
      throw new Error('An error has occurred while deleting and return a single example suggestion');
    })
);

/* Deletes a single ExampleSuggestion by using an id */
export const deleteExampleSuggestion = async (req, res) => {
  const { id } = req.params;
  try {
    return res.send(await removeExampleSuggestion(id));
  } catch (err) {
    res.status(400);
    return res.send({ error: err.message });
  }
};
