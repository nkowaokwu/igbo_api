import {
  assign,
  every,
  has,
  partial,
} from 'lodash';
import WordSuggestion from '../models/WordSuggestion';

const REQUIRE_KEYS = ['id', 'word', 'wordClass', 'definitions'];

/* Creates a new WordSuggestion document in the database */
export const postWordSuggestion = (req, res) => {
  const { body: data } = req;
  const newWordSuggestion = new WordSuggestion(data);
  newWordSuggestion.save()
    .then((wordSuggestion) => (
      res.send({ id: wordSuggestion.id })
    ))
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while saving, double check your provided data' });
    });
};

/* Updates an existing WordSuggestion object */
export const putWordSuggestion = (req, res) => {
  const { body: data } = req;
  if (!every(REQUIRE_KEYS, partial(has, data))) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  return WordSuggestion.findById(data.id)
    .then(async (wordSuggestion) => {
      const updatedWordSuggestion = assign(wordSuggestion, data);
      res.send(await updatedWordSuggestion.save());
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while updating, double check your provided data' });
    });
};
