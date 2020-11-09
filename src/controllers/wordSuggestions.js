import mongoose from 'mongoose';
import {
  assign,
  every,
  has,
  partial,
  map,
  trim,
  pick,
  differenceBy,
} from 'lodash';
import WordSuggestion from '../models/WordSuggestion';
import ExampleSuggestion from '../models/ExampleSuggestion';
import { createExampleSuggestion, updateExampleSuggestion, removeExampleSuggestion } from './exampleSuggestions';
import { prepResponse, handleQueries } from './utils';
import SuggestionTypes from '../shared/constants/suggestionTypes';
import { sendRejectedEmail } from './mail';

const REQUIRE_KEYS = ['word', 'wordClass', 'definitions'];

/* Picks out the examples key in the data payload */
const getExamplesFromClientData = (data) => (pick(data, ['examples']) || {}).examples || [];

/* Adds the example key on each wordSuggestion returned back to the client */
const placeExampleSuggestionsOnWordSuggestion = async (wordSuggestion) => {
  const LEAN_EXAMPLE_KEYS = 'igbo english associatedWords id';
  const examples = await ExampleSuggestion
    .find({ associatedWords: wordSuggestion.id })
    .select(LEAN_EXAMPLE_KEYS);
  return { ...wordSuggestion.toObject(), examples };
};

/* Creates a new WordSuggestion document in the database */
export const postWordSuggestion = async (req, res) => {
  const { body: data } = req;

  const clientExamples = getExamplesFromClientData(data);

  if (data.originalWordId && !mongoose.Types.ObjectId.isValid(data.originalWordId)) {
    res.status(400);
    return res.send({ error: 'Invalid word id provided' });
  }

  if (!Array.isArray(data.definitions)) {
    data.definitions = map(data.definitions.split(','), (definition) => trim(definition));
  }

  const newWordSuggestion = new WordSuggestion(data);
  return newWordSuggestion.save()
    .then(async (wordSuggestion) => {
      await Promise.all(map(clientExamples, async (example) => (
        createExampleSuggestion({ ...example, associatedWords: [wordSuggestion.id] })
      )));
      const savedWordSuggestion = await placeExampleSuggestionsOnWordSuggestion(wordSuggestion);
      return res.send(savedWordSuggestion);
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while saving, double check your provided data' });
    });
};

export const findWordSuggestionById = (id) => (
  WordSuggestion.findById(id)
);

/* Either deletes exampleSuggestion or updates exampleSuggestion associatedWords */
const handleDeletingExampleSuggestions = async ({ wordSuggestion, clientExamples }) => {
  const examples = await ExampleSuggestion.find({ associatedWords: wordSuggestion.id });
  /* An example on the client side has been removed */
  if (examples.length > clientExamples.length) {
    const examplesToDelete = differenceBy(examples, clientExamples, 'id');
    /* Steps through all examples to either delete exampleSuggestion or
     * updates the associatedWords list of an existing exampleSuggestion
     */
    map(examplesToDelete, (exampleToDelete) => {
      const LAST_ASSOCIATED_WORD = 1;
      /* Deletes example if there's only one last associated word */
      if (exampleToDelete.associatedWords.length <= LAST_ASSOCIATED_WORD
        && exampleToDelete.associatedWords.includes(wordSuggestion.id)) {
        removeExampleSuggestion(exampleToDelete.id);
      }
    });
  }
};

/* Updates an existing WordSuggestion object */
export const putWordSuggestion = (req, res) => {
  const { body: data, params: { id } } = req;

  const clientExamples = getExamplesFromClientData(data);

  if (!every(REQUIRE_KEYS, partial(has, data))) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  if (!Array.isArray(data.definitions)) {
    data.definitions = map(data.definitions.split(','), (definition) => trim(definition));
  }

  return findWordSuggestionById(id)
    .then(async (wordSuggestion) => {
      if (!wordSuggestion) {
        res.status(400);
        return res.send({ error: 'Word suggestion doesn\'t exist' });
      }
      const updatedWordSuggestion = assign(wordSuggestion, data);
      await handleDeletingExampleSuggestions({ wordSuggestion, clientExamples });

      /* Updates all the word's children exampleSuggestions */
      await Promise.all(map(clientExamples, (example) => (
        !example.id
          ? createExampleSuggestion({
            ...example,
            exampleForWordSuggestion: true,
            associatedWords: [wordSuggestion.id],
          }) : updateExampleSuggestion({ id: example.id, data: example })
      )));
      const savedWordSuggestions = await placeExampleSuggestionsOnWordSuggestion(updatedWordSuggestion);
      return res.send(savedWordSuggestions);
    })
    .catch((err) => {
      res.status(400);
      return res.send({ error: err.message });
    });
};

/* Returns all existing WordSuggestion objects */
export const getWordSuggestions = (req, res) => {
  const { regexKeyword, ...rest } = handleQueries(req.query);
  WordSuggestion
    .where('word').equals(regexKeyword)
    .sort({ approvals: 'desc' })
    .then(async (wordSuggestions) => {
      /* Places the exampleSuggestions on the corresponding wordSuggestions */
      const wordSuggestionsWithExamples = await Promise.all(
        map(wordSuggestions, placeExampleSuggestionsOnWordSuggestion),
      );
      return prepResponse({ res, docs: await wordSuggestionsWithExamples, ...rest });
    })
    .catch((err) => {
      res.status(400);
      return res.send({ error: err.message });
    });
};

/* Returns a single WordSuggestion by using an id */
export const getWordSuggestion = (req, res) => {
  const { id } = req.params;
  return WordSuggestion
    .findById(id)
    .then(async (wordSuggestion) => {
      if (!wordSuggestion) {
        res.status(400);
        return res.send({ error: 'No word suggestion exists with the provided id.' });
      }
      const wordSuggestionWithExamples = await placeExampleSuggestionsOnWordSuggestion(wordSuggestion);
      return res.send(wordSuggestionWithExamples);
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while returning a single word suggestion' });
    });
};

/* Deletes a single WordSuggestion by using an id */
export const deleteWordSuggestion = (req, res) => {
  const { id } = req.params;
  return WordSuggestion.findByIdAndDelete(id)
    .then((wordSuggestion) => {
      if (!wordSuggestion) {
        res.status(400);
        return res.send({ error: 'No word suggestion exists with the provided id.' });
      }
      /* Sends rejection email to user if they provided an email and the wordSuggestion isn't merged */
      if (wordSuggestion.userEmail && !wordSuggestion.merged) {
        sendRejectedEmail({
          to: wordSuggestion.userEmail,
          suggestionType: SuggestionTypes.WORD,
          ...wordSuggestion,
        });
      }
      return res.send(wordSuggestion);
    })
    .catch(() => {
      res.status(400);
      return res.send({ error: 'An error has occurred while deleting and return a single word suggestion' });
    });
};
