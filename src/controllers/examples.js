import Example from '../models/Example';
import { paginate, handleQueries } from './utils';

/* Create a new Example object in MongoDB */
export const createExample = (data) => {
  const example = new Example(data);
  return example.save();
};

const searchExamples = (regex) => (
  Example
    .find({ $or: [{ igbo: regex }, { english: regex }] })
);

export const getExamples = async (req, res) => {
  const { regexKeyword, page } = handleQueries(req.query);
  const examples = await searchExamples(regexKeyword);

  return paginate(res, examples, page);
};
