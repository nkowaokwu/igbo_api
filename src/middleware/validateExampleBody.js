import mongoose from 'mongoose';
import {
  map,
  some,
  uniq,
  trim,
} from 'lodash';

export default (req, res, next) => {
  const { body: data } = req;
  if (!data.igbo && !data.english) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  if (!Array.isArray(data.associatedWords)) {
    data.associatedWords = data.associatedWords
      ? map(data.associatedWords.split(','), (associatedWord) => trim(associatedWord))
      : [];
  }

  if (some(data.associatedWords, (associatedWord) => !mongoose.Types.ObjectId.isValid(associatedWord))) {
    res.status(400);
    return res.send({ error: 'Invalid id found in associatedWords' });
  }

  if (data.associatedWords && data.associatedWords.length !== uniq(data.associatedWords).length) {
    res.status(400);
    return res.send({ error: 'Duplicates are not allowed in associated words' });
  }

  return next();
};
