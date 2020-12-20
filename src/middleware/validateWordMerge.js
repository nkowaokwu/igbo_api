import { findGenericWordById } from '../controllers/genericWords';
import { findWordSuggestionById } from '../controllers/wordSuggestions';

export default async (req, res, next) => {
  const { body: data } = req;
  const { user } = req;
  const suggestionDoc = (await findWordSuggestionById(data.id)) || (await findGenericWordById(data.id));

  if (!user || (user && !user.uid)) {
    res.status(400);
    return res.send({ error: 'User uid is required' });
  }

  if (!suggestionDoc) {
    res.status(400);
    return res.send({
      error: 'There is no associated generic word or word suggestion, double check your provided data',
    });
  }

  if (!suggestionDoc.word) {
    res.status(400);
    return res.send({ error: 'The word property is missing, double check your provided data' });
  }

  if (!suggestionDoc.wordClass) {
    res.status(400);
    return res.send({ error: 'The word class property is missing, double check your provided data' });
  }

  if (!suggestionDoc.definitions) {
    res.status(400);
    return res.send({ error: 'The definition property is missing, double check your provided data' });
  }

  if (!suggestionDoc.id) {
    res.status(400);
    return res.send({ error: 'The id property is missing, double check your provided data' });
  }
  req.suggestionDoc = suggestionDoc;
  return next();
};
