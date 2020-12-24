import {
  assign,
  every,
  has,
  partial,
  map,
  trim,
} from 'lodash';
import WordSuggestion from '../models/WordSuggestion';
import { packageResponse, handleQueries, populateFirebaseUsers } from './utils';
import { searchForLastWeekQuery, searchPreExistingWordSuggestionsRegexQuery } from './utils/queries';
import {
  handleDeletingExampleSuggestions,
  getExamplesFromClientData,
  updateNestedExampleSuggestions,
  placeExampleSuggestionsOnSuggestionDoc,
} from './utils/nestedExampleSuggestionUtils';
import SortingDirections from '../shared/constants/sortingDirections';
import SuggestionTypes from '../shared/constants/suggestionTypes';
import { sendRejectedEmail } from './email';

const REQUIRE_KEYS = ['word', 'wordClass', 'definitions'];

/* Creates a new WordSuggestion document in the database */
export const postWordSuggestion = async (req, res, next) => {
  try {
    const { body: data } = req;
    const { user } = req;

    data.authorId = user.uid;

    const clientExamples = getExamplesFromClientData(data);
    const newWordSuggestion = new WordSuggestion(data);
    const savedWordSuggestion = await newWordSuggestion.save()
      .then(async (wordSuggestion) => {
        await updateNestedExampleSuggestions({ suggestionDocId: wordSuggestion.id, clientExamples });
        return placeExampleSuggestionsOnSuggestionDoc(wordSuggestion);
      });
    return res.send(savedWordSuggestion);
  } catch (err) {
    return next(err);
  }
};

export const findWordSuggestionById = (id) => (
  WordSuggestion.findById(id)
);

export const deleteWordSuggestionsByOriginalWordId = (id) => (
  WordSuggestion.deleteMany({ originalWordId: id })
);

/* Grabs WordSuggestions and sorts them by their last update in descending order */
const findWordSuggestions = async ({ regexMatch, skip, limit }) => (
  WordSuggestion
    .find(regexMatch)
    .sort({ updatedOn: SortingDirections.DESCENDING })
    .skip(skip)
    .limit(limit)
);

/* Updates an existing WordSuggestion object */
export const putWordSuggestion = (req, res, next) => {
  try {
    const { body: data, params: { id } } = req;
    const clientExamples = getExamplesFromClientData(data);

    if (!every(REQUIRE_KEYS, partial(has, data))) {
      throw new Error('Required information is missing, double check your provided data');
    }

    if (!Array.isArray(data.definitions)) {
      data.definitions = map(data.definitions.split(','), (definition) => trim(definition));
    }

    return findWordSuggestionById(id)
      .then(async (wordSuggestion) => {
        if (!wordSuggestion) {
          throw new Error('Word suggestion doesn\'t exist');
        }
        delete data.authorId;
        const updatedWordSuggestion = assign(wordSuggestion, data);
        await handleDeletingExampleSuggestions({ suggestionDoc: wordSuggestion, clientExamples });

        /* Updates all the word's children exampleSuggestions */
        await updateNestedExampleSuggestions({ suggestionDocId: wordSuggestion.id, clientExamples });
        await updatedWordSuggestion.save();
        const savedWordSuggestion = await placeExampleSuggestionsOnSuggestionDoc(updatedWordSuggestion);
        return res.send(savedWordSuggestion);
      })
      .catch(next);
  } catch (err) {
    return next(err);
  }
};

/* Returns all existing WordSuggestion objects */
export const getWordSuggestions = (req, res, next) => {
  try {
    const {
      regexKeyword,
      skip,
      limit,
      ...rest
    } = handleQueries(req);
    const regexMatch = searchPreExistingWordSuggestionsRegexQuery(regexKeyword);
    return findWordSuggestions({ regexMatch, skip, limit })
      .then(async (wordSuggestions) => {
        /* Places the exampleSuggestions on the corresponding wordSuggestions */
        const wordSuggestionsWithExamples = await Promise.all(
          map(wordSuggestions, placeExampleSuggestionsOnSuggestionDoc),
        );
        return packageResponse({
          res,
          docs: wordSuggestionsWithExamples,
          model: WordSuggestion,
          query: regexMatch,
          ...rest,
        });
      })
      .catch(next);
  } catch (err) {
    return next(err);
  }
};

/* Returns a single WordSuggestion by using an id */
export const getWordSuggestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const populatedWordSuggestion = await WordSuggestion
      .findById(id)
      .then(async (wordSuggestion) => {
        if (!wordSuggestion) {
          throw new Error('No word suggestion exists with the provided id.');
        }
        const wordSuggestionWithExamples = await placeExampleSuggestionsOnSuggestionDoc(wordSuggestion);
        const populatedUsersWordSuggestionWithExamples = await populateFirebaseUsers(
          wordSuggestionWithExamples,
          ['approvals', 'denials'],
        );
        return populatedUsersWordSuggestionWithExamples;
      });
    return res.send(populatedWordSuggestion);
  } catch (err) {
    return next(err);
  }
};

/* Deletes a single WordSuggestion by using an id */
export const deleteWordSuggestion = (req, res, next) => {
  try {
    const { id } = req.params;
    return WordSuggestion.findByIdAndDelete(id)
      .then((wordSuggestion) => {
        if (!wordSuggestion) {
          throw new Error('No word suggestion exists with the provided id.');
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
        throw new Error('An error has occurred while deleting and return a single word suggestion');
      });
  } catch (err) {
    return next(err);
  }
};

/* Returns all the WordSuggestions from last week */
export const getWordSuggestionsFromLastWeek = () => (
  WordSuggestion
    .find(searchForLastWeekQuery())
    .lean()
    .exec()
);
