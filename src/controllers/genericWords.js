import {
  assign,
  every,
  has,
  partial,
  map,
  trim,
} from 'lodash';
import GenericWord from '../models/GenericWord';
import testGenericWordsDictionary from '../../tests/__mocks__/genericWords.mock.json';
import genericWordsDictionary from '../dictionaries/ig-en/ig-en_normalized_expanded.json';
import SortingDirections from '../shared/constants/sortingDirections';
import { packageResponse, handleQueries, populateFirebaseUsers } from './utils';
import { searchForLastWeekQuery, searchPreExistingGenericWordsRegexQuery } from './utils/queries';
import {
  handleDeletingExampleSuggestions,
  getExamplesFromClientData,
  updateNestedExampleSuggestions,
  placeExampleSuggestionsOnSuggestionDoc,
} from './utils/nestedExampleSuggestionUtils';

const REQUIRE_KEYS = ['word', 'wordClass', 'definitions'];

/* Updates an existing WordSuggestion object */
export const putGenericWord = async (req, res, next) => {
  try {
    const { body: data, params: { id } } = req;
    const clientExamples = getExamplesFromClientData(data);

    if (!every(REQUIRE_KEYS, partial(has, data))) {
      throw new Error('Required information is missing, double check your provided data');
    }

    if (!Array.isArray(data.definitions)) {
      data.definitions = map(data.definitions.split(','), (definition) => trim(definition));
    }

    const updatedAndSavedGenericWord = await GenericWord.findById(id)
      .then(async (genericWord) => {
        if (!genericWord) {
          throw new Error('Generic word doesn\'t exist');
        }
        const updatedGenericWord = assign(genericWord, data);
        await handleDeletingExampleSuggestions({ suggestionDoc: genericWord, clientExamples });

        /* Updates all the word's children exampleSuggestions */
        await updateNestedExampleSuggestions({ suggestionDocId: genericWord.id, clientExamples });

        await updatedGenericWord.save();
        const savedGenericWord = await placeExampleSuggestionsOnSuggestionDoc(updatedGenericWord);
        return savedGenericWord;
      });
    return res.send(updatedAndSavedGenericWord);
  } catch (err) {
    return next(err);
  }
};

export const findGenericWordById = (id) => (
  GenericWord.findById(id)
);

/* Grabs GenericWords and sorts them by their last update in descending order */
export const findGenericWords = async ({ regexMatch, skip, limit }) => (
  GenericWord
    .find(regexMatch)
    .sort({ updatedOn: SortingDirections.DESCENDING })
    .skip(skip)
    .limit(limit)
);

/* Returns all existing GenericWord objects */
export const getGenericWords = (req, res, next) => {
  try {
    const {
      regexKeyword,
      skip,
      limit,
      ...rest
    } = handleQueries(req);
    const regexMatch = searchPreExistingGenericWordsRegexQuery(regexKeyword);
    return findGenericWords({ regexMatch, skip, limit })
      .then(async (genericWords) => {
        /* Places the exampleSuggestions on the corresponding genericWords */
        const genericWordsWithExamples = await Promise.all(
          map(genericWords, placeExampleSuggestionsOnSuggestionDoc),
        );
        const packagedResponse = await packageResponse({
          res,
          docs: genericWordsWithExamples,
          model: GenericWord,
          query: regexMatch,
          ...rest,
        });
        return packagedResponse;
      })
      .catch(() => {
        throw new Error('An error has occurred while returning all generic words');
      });
  } catch (err) {
    return next(err);
  }
};

/* Returns a single WordSuggestion by using an id */
export const getGenericWord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const populatedGenericWord = await findGenericWordById(id)
      .then(async (genericWord) => {
        if (!genericWord) {
          throw new Error('No genericWord exists with the provided id.');
        }
        const genericWordWithExamples = await placeExampleSuggestionsOnSuggestionDoc(genericWord);
        const populatedUsersGenricWordWithExamples = await populateFirebaseUsers(
          genericWordWithExamples,
          ['approvals', 'denials'],
        );
        return populatedUsersGenricWordWithExamples;
      });
    return res.send(populatedGenericWord);
  } catch (err) {
    return next(err);
  }
};

const seedGenericWords = async (dictionary) => (
  map(dictionary, (value, key) => {
    const newGenericWord = new GenericWord({
      word: key,
      definitions: value,
    });
    return newGenericWord.save();
  })
);

/* Populates the MongoDB database with GenericWords */
export const createGenericWords = async (_, res, next) => {
  try {
    const dictionary = process.env.NODE_ENV === 'test' ? testGenericWordsDictionary : genericWordsDictionary;
    const genericWordsPromises = await seedGenericWords(dictionary);
    const genericWords = await Promise.all(genericWordsPromises)
      .then(() => {
        if (process.env.NODE_ENV !== 'production') {
          console.green('✅ Seeding successful for genericWords');
        }
        return 'Successfully populated generic words';
      });
    return res.send(genericWords);
  } catch (err) {
    return next(err);
  }
};

/* Deletes a single GenericWord by using an id */
export const deleteGenericWord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedGenericWord = await GenericWord.findByIdAndDelete(id)
      .then((genericWord) => {
        if (!genericWord) {
          throw new Error('No generic word exists with the provided id.');
        }
        return genericWord;
      });
    return res.send(deletedGenericWord);
  } catch (err) {
    return next(err);
  }
};

/* Returns all the GenericWords from last week */
export const getGenericWordsFromLastWeek = () => (
  GenericWord
    .find(searchForLastWeekQuery())
    .lean()
    .exec()
);
