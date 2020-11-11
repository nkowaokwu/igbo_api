import {
  pick,
  differenceBy,
  reduce,
  map,
} from 'lodash';
import ExampleSuggestion from '../../models/ExampleSuggestion';
import {
  createExampleSuggestion,
  updateExampleSuggestion,
  removeExampleSuggestion,
} from '../exampleSuggestions';

/* Adds the example key on each wordSuggestion returned back to the client */
export const placeExampleSuggestionsOnSuggestionDoc = async (wordSuggestion) => {
  const LEAN_EXAMPLE_KEYS = 'igbo english associatedWords id';
  const examples = await ExampleSuggestion
    .find({ associatedWords: wordSuggestion.id })
    .select(LEAN_EXAMPLE_KEYS);
  return { ...wordSuggestion.toObject(), examples };
};

/* Picks out the examples key in the data payload */
export const getExamplesFromClientData = (data) => {
  const examples = (pick(data, ['examples']) || {}).examples || [];
  /* Removes originalExampleId if it's an empty string */
  return reduce(examples, (cleanedExamples, example) => {
    const cleanedExample = { ...example };
    if (!cleanedExample.originalExampleId) {
      delete cleanedExample.originalExampleId;
    }
    return [...cleanedExamples, cleanedExample];
  }, []);
};

/* Either deletes exampleSuggestion or updates exampleSuggestion associatedWords */
export const handleDeletingExampleSuggestions = async ({ suggestionDoc, clientExamples }) => {
  const examples = await ExampleSuggestion.find({ associatedWords: suggestionDoc.id });
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
        && exampleToDelete.associatedWords.includes(suggestionDoc.id)) {
        removeExampleSuggestion(exampleToDelete.id);
      }
    });
  }
};

/* Handles either creating or updating nested example suggestions */
export const updateNestedExampleSuggestions = ({ suggestionDocId, clientExamples }) => (
  /* Updates all the word's children exampleSuggestions */
  Promise.all(map(clientExamples, (example) => (
    !example.id
      ? createExampleSuggestion({
        ...example,
        exampleForSuggestion: true,
        associatedWords: Array.from(
          new Set( // Filters out duplicates
            [...(Array.isArray(example.associatedWords) ? example.associatedWords : []), suggestionDocId],
          ),
        ),
      }) : (async () => (
        ExampleSuggestion.findById(example.id)
          .then((exampleSuggestion) => {
            if (!exampleSuggestion) {
              throw new Error('No example suggestion exists with the provided id.');
            }
            return updateExampleSuggestion({ id: example.id, data: example });
          })
          .catch(() => {
            throw new Error('An error occurred while finding nested example suggestion.');
          })
      ))()
  )))
);
