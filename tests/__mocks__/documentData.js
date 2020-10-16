import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

const wordId = new ObjectId('5f864d7401203866b6546dd3');
const wordSuggestionData = {
  originalWordId: wordId,
  word: 'word',
  wordClass: 'wordClass',
  definitions: ['first'],
};

const malformedWordSuggestionData = {
  word: 'word',
  wordCllass: 'wordClass',
  definitions: ['first'],
};

const updatedWordSuggestionData = {
  word: 'newWord',
  wordClass: 'newWordClass',
  definitions: ['first', 'second'],
};

const malformedWordData = {
  worrd: 'newWord',
  wordClass: '',
  definitions: [],
};

const exampleSuggestionData = {
  igbo: 'igbo text',
  english: 'english text',
};

const malformedExampleSuggestionData = {
  associatedWords: ['wrong'],
};

const exampleId = new ObjectId('5f864d7401203866b6546dd3');
const updatedExampleSuggestionData = {
  igbo: 'updated igbo',
  english: 'updated english',
  associatedWords: [exampleId],
};

export {
  wordSuggestionData,
  malformedWordSuggestionData,
  updatedWordSuggestionData,
  malformedWordData,
  exampleSuggestionData,
  malformedExampleSuggestionData,
  updatedExampleSuggestionData,
};
