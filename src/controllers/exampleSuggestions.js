import mongoose from 'mongoose';
import { assign, some, map } from 'lodash';
import SuggestionTypes from '../shared/constants/suggestionTypes';
import SortingDirections from '../shared/constants/sortingDirections';
import Word from '../models/Word';
import ExampleSuggestion from '../models/ExampleSuggestion';
import { packageResponse, handleQueries, populateFirebaseUsers } from './utils/index';
import {
  searchExampleSuggestionsRegexQuery,
  searchForLastWeekQuery,
  searchPreExistingExampleSuggestionsRegexQuery,
} from './utils/queries';
import { sendRejectedEmail } from './email';

export const createExampleSuggestion = async (data) => {
  if (!data.igbo && !data.english) {
    throw new Error('Required information is missing, double check your provided data');
  }

  if (some(data.associatedWords, (associatedWord) => !mongoose.Types.ObjectId.isValid(associatedWord))) {
    throw new Error('Invalid id found in associatedWords');
  }

  await Promise.all(map(data.associatedWords, async (associatedWordId) => {
    const query = searchPreExistingExampleSuggestionsRegexQuery({ ...data, associatedWordId });
    const identicalExampleSuggestions = await ExampleSuggestion
      .find(query);

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
export const postExampleSuggestion = async (req, res, next) => {
  try {
    const { body: data } = req;
    const { user } = req;

    data.authorId = user.uid;

    await Promise.all(
      map(data.associatedWords, async (associatedWordId) => {
        if (!(await Word.findById(associatedWordId))) {
          throw new Error('Example suggestion associated words can only contain Word ids');
        }
      }),
    );

    const createdExampleSuggestion = createExampleSuggestion(data);
    return res.send(await createdExampleSuggestion);
  } catch (err) {
    return next(err);
  }
};

export const updateExampleSuggestion = ({ id, data: clientData }) => {
  const data = assign(clientData);
  delete data.authorId;
  return ExampleSuggestion.findById(id)
    .then(async (exampleSuggestion) => {
      if (!exampleSuggestion) {
        throw new Error('Example suggestion doesn\'t exist');
      }
      const updatedExampleSuggestion = assign(exampleSuggestion, data);
      return updatedExampleSuggestion.save();
    })
    .catch((err) => {
      throw err;
    });
};

/* Updates an existing ExampleSuggestion object */
export const putExampleSuggestion = async (req, res, next) => {
  try {
    const { body: data, params: { id } } = req;

    await Promise.all(
      map(data.associatedWords, async (associatedWordId) => {
        if (!(await Word.findById(associatedWordId))) {
          throw new Error('Example suggestion associated words can only contain Word ids');
        }
      }),
    );

    const updatedExampleSuggestion = updateExampleSuggestion({ id, data });
    return res.send(await updatedExampleSuggestion);
  } catch (err) {
    return next(err);
  }
};

export const findExampleSuggestionById = (id) => (
  ExampleSuggestion.findById(id)
);

/* Grabs ExampleSugestions and sorts them by their last update in descending order */
const findExampleSuggestions = ({ regexMatch, skip, limit }) => (
  ExampleSuggestion
    .find(regexMatch)
    .sort({ updatedOn: SortingDirections.DESCENDING })
    .skip(skip)
    .limit(limit)
);

/* Returns all existing ExampleSuggestion objects */
export const getExampleSuggestions = (req, res, next) => {
  try {
    const {
      regexKeyword,
      skip,
      limit,
      ...rest
    } = handleQueries(req);
    const regexMatch = searchExampleSuggestionsRegexQuery(regexKeyword);
    return findExampleSuggestions({ regexMatch, skip, limit })
      .then((exampleSuggestions) => (
        packageResponse({
          res,
          docs: exampleSuggestions,
          model: ExampleSuggestion,
          query: regexMatch,
          ...rest,
        })
      ))
      .catch(() => {
        throw new Error('An error has occurred while return example suggestions, double check your provided data');
      });
  } catch (err) {
    return next(err);
  }
};

/* Returns a single ExampleSuggestion by using an id */
export const getExampleSuggestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const populatedUser = await findExampleSuggestionById(id)
      .then(async (exampleSuggestion) => {
        if (!exampleSuggestion) {
          throw new Error('No example suggestion exists with the provided id.');
        }
        const populatedUserExampleSuggestion = await populateFirebaseUsers(exampleSuggestion, ['approvals', 'denials']);
        return populatedUserExampleSuggestion;
      });
    return res.send(populatedUser);
  } catch (err) {
    return next(err);
  }
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
export const deleteExampleSuggestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    return res.send(await removeExampleSuggestion(id));
  } catch (err) {
    return next(err);
  }
};

/* Returns all the ExampleSuggestions from last week */
export const getExampleSuggestionsFromLastWeek = () => (
  ExampleSuggestion
    .find(searchForLastWeekQuery())
    .lean()
    .exec()
);
