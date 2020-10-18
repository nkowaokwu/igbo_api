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

const wordData = {
  word: 'word',
  wordClass: 'noun',
  definitions: [],
};

const malformedWordData = {
  worrd: 'newWord',
  wordClass: '',
  definitions: [],
};

const updatedWordData = {
  word: 'newWord',
  wordClass: 'verb',
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

const exampleData = {
  igbo: 'igbo text',
  english: 'english text',
};

const updatedExampleData = {
  igbo: 'updated igbo text',
  english: 'updated english text',
  associatedWords: ['5f864d7401203866b6546dd3'],
};

const genericWordData = {
  word: 'genericWord',
  wordClass: 'noun',
  definitions: [],
};

const malformedGenericWordData = {
  word: 'newGenericWord',
  wordClass: '',
  definitions: [],
  approvals: 'car',
};

const updatedGenericWordData = {
  word: 'newWord',
  wordClass: 'verb',
  definitions: ['required'],
  approvals: 2,
  denials: 1,
};

export {
  wordSuggestionData,
  malformedWordSuggestionData,
  updatedWordSuggestionData,
  wordData,
  malformedWordData,
  updatedWordData,
  exampleSuggestionData,
  malformedExampleSuggestionData,
  updatedExampleSuggestionData,
  exampleData,
  updatedExampleData,
  genericWordData,
  malformedGenericWordData,
  updatedGenericWordData,
};
