import mongoose from 'mongoose';
import { assign, some } from 'lodash';
import Example from '../models/Example';
import { paginate, handleQueries } from './utils';

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
  const { regexKeyword, page } = handleQueries(req.query);
  const examples = await searchExamples(regexKeyword);

  return paginate(res, examples, page);
};

/* Call the createExample helper function and returns status to client */
export const postExample = (req, res) => {
  const { body: data } = req;

  if (!data.igbo && !data.english) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  if (some(data.associatedWords, (associatedWord) => !mongoose.Types.ObjectId.isValid(associatedWord))) {
    res.status(400);
    return res.send({ error: 'Invalid id found in associatedWords' });
  }

  try {
    return createExample(data)
      .then((example) => (
        res.send({ id: example.id })
      ))
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

  return Example.findById(id)
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
