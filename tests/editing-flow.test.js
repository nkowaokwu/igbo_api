import chai from 'chai';
import { forEach, isEqual } from 'lodash';
import {
  getWordSuggestion,
  deleteWordSuggestion,
  getWord,
  getExample,
  createExample,
  suggestNewWord,
  suggestNewExample,
  createWord,
  getExampleSuggestion,
  updateGenericWord,
  deleteGenericWord,
  getGenericWord,
  getGenericWords,
  updateWordSuggestion,
} from './shared/commands';
import {
  genericWordData,
  wordSuggestionData,
  wordSuggestionWithNestedExampleSuggestionData,
  genericWordWithNestedExampleSuggestionData,
  exampleSuggestionData,
} from './__mocks__/documentData';
import { SAVE_DOC_DELAY } from './shared/constants';

const { expect } = chai;

describe('Editing Flow', () => {
  it('should create a new wordSuggestion and then merge', (done) => {
    suggestNewWord(wordSuggestionData)
      .then((wordSuggestionRes) => {
        expect(wordSuggestionRes.status).to.equal(200);
        createWord(wordSuggestionRes.body)
          .then((mergedWordRes) => {
            expect(mergedWordRes.status).to.equal(200);
            getWordSuggestion(wordSuggestionRes.body.id)
              .end((_, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.merged).to.equal(mergedWordRes.body.id);
                done();
              });
          });
      });
  });

  it('should throw an error for invalid data while creating a wordSuggestion', (done) => {
    suggestNewWord({ ...wordSuggestionData, definitions: [] })
      .then((wordSuggestionRes) => {
        expect(wordSuggestionRes.status).to.equal(400);
        done();
      });
  });

  it('should create a new genericWord and then merge', (done) => {
    suggestNewWord(genericWordData)
      .then((genericWordRes) => {
        expect(genericWordRes.status).to.equal(200);
        createWord(genericWordRes.body)
          .then((mergedWordRes) => {
            expect(mergedWordRes.status).to.equal(200);
            getWordSuggestion(genericWordRes.body.id)
              .end((_, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.merged).to.equal(mergedWordRes.body.id);
                done();
              });
          });
      });
  });

  it('should throw an error for invalid data while creating a genericWord', (done) => {
    suggestNewWord({ ...genericWordData, definitions: [] })
      .then((genericWordRes) => {
        expect(genericWordRes.status).to.equal(400);
        done();
      });
  });

  it('should create a new wordSuggestion with a nested exampleSuggestion then merge', (done) => {
    suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
      .then((wordSuggestionRes) => {
        expect(wordSuggestionRes.status).to.equal(200);
        createWord(wordSuggestionRes.body)
          .then((mergedWordRes) => {
            expect(mergedWordRes.status).to.equal(200);
            setTimeout(() => {
              getWord(mergedWordRes.body.id)
                .then((wordRes) => {
                  const mergedWord = wordRes.body;
                  const nestedExample = mergedWord.examples[0];
                  Promise.all([
                    getExample(nestedExample.id),
                    getWordSuggestion(wordSuggestionRes.body.id),
                  ])
                    .then((res) => {
                      const mergedExample = res[0].body;
                      const wordSuggestion = res[1].body;
                      expect(mergedExample.associatedWords).includes(mergedWord.id);
                      expect(wordSuggestion.merged).to.equal(mergedWord.id);
                      expect(mergedWord.examples[0].associatedWords).includes(mergedWord.id);
                      expect(mergedWord.examples[0].id).equal(mergedExample.id);
                      done();
                    });
                });
            }, SAVE_DOC_DELAY);
          });
      });
  });

  it('should add a new associatedWordId to exampleSuggestion', (done) => {
    suggestNewWord(wordSuggestionData)
      .then((res) => {
        createWord(res.body)
          .then((firstWordRes) => {
            suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
              .then((wordSuggestionRes) => {
                expect(wordSuggestionRes.status).to.equal(200);
                createWord(wordSuggestionRes.body)
                  .then((mergedWordRes) => {
                    expect(mergedWordRes.status).to.equal(200);
                    setTimeout(() => {
                      getWord(mergedWordRes.body.id)
                        .then((wordRes) => {
                          expect(wordRes.status).to.equal(200);
                          const example = wordRes.body.examples[0];
                          const newExampleSuggestion = {
                            ...example,
                            associatedWords: [...example.associatedWords, firstWordRes.body.id],
                          };
                          suggestNewExample(newExampleSuggestion)
                            .then((exampleSuggestionRes) => {
                              expect(exampleSuggestionRes.status).to.equal(200);
                              createExample(exampleSuggestionRes.body)
                                .end((_, finalRes) => {
                                  expect(isEqual(
                                    exampleSuggestionRes.body.associatedWords,
                                    finalRes.body.associatedWords,
                                  )).to.equal(true);
                                  done();
                                });
                            });
                        });
                    }, SAVE_DOC_DELAY);
                  });
              });
          });
      });
  });

  it('should throw an error for duplicate associated words', (done) => {
    suggestNewWord(wordSuggestionData)
      .then((wordSuggestionRes) => {
        const exampleData = {
          ...exampleSuggestionData,
          associatedWords: [wordSuggestionRes.body.id, wordSuggestionRes.body.id],
        };
        suggestNewExample(exampleData)
          .then((exampleSuggestionRes) => {
            expect(exampleSuggestionRes.status).to.equal(400);
            done();
          });
      });
  });

  it('should create a new genericWord with a nested exampleSuggestion then merger', (done) => {
    suggestNewWord(genericWordWithNestedExampleSuggestionData)
      .then((genericWordRes) => {
        expect(genericWordRes.status).to.equal(200);
        createWord(genericWordRes.body)
          .then((mergedWordRes) => {
            expect(mergedWordRes.status).to.equal(200);
            setTimeout(() => {
              getWord(mergedWordRes.body.id)
                .then((wordRes) => {
                  const mergedWord = wordRes.body;
                  const nestedExample = mergedWord.examples[0];
                  Promise.all([
                    getExample(nestedExample.id),
                    getWordSuggestion(genericWordRes.body.id),
                  ])
                    .then((res) => {
                      const mergedExample = res[0].body;
                      const wordSuggestion = res[1].body;
                      expect(mergedExample.associatedWords).includes(mergedWord.id);
                      expect(wordSuggestion.merged).to.equal(mergedWord.id);
                      expect(mergedWord.examples[0].associatedWords).includes(mergedWord.id);
                      expect(mergedWord.examples[0].id).equal(mergedExample.id);
                      done();
                    });
                });
            }, SAVE_DOC_DELAY);
          });
      });
  });

  it('should delete a new wordSuggestion with a nested exampleSuggestions', (done) => {
    suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
      .then((wordSuggestionRes) => {
        expect(wordSuggestionRes.status).to.equal(200);
        const nestedExampleSuggestion = wordSuggestionRes.body.examples[0];
        deleteWordSuggestion(wordSuggestionRes.body.id)
          .then((deleteWordSuggestionRes) => {
            expect(deleteWordSuggestionRes.status).to.equal(200);
            Promise.all([
              getWordSuggestion(wordSuggestionRes.body.id),
              getExampleSuggestion(nestedExampleSuggestion.id),
            ])
              .then((res) => {
                forEach(res, ({ status, body }) => {
                  expect(status).to.equal(400);
                  expect(body.error).to.not.equal(undefined);
                });
                done();
              });
          });
      });
  });

  it('should update wordSuggestion with nested exampleSuggestions', (done) => {
    suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
      .then((wordSuggestionRes) => {
        expect(wordSuggestionRes.status).to.equal(200);
        const updatedWordSuggestion = {
          ...wordSuggestionRes.body,
          word: 'newWord',
        };
        updateWordSuggestion(updatedWordSuggestion.id, updatedWordSuggestion)
          .end((_, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.word).to.equal('newWord');
            done();
          });
      });
  });

  it.skip('should delete a new genericWord with a nested exampleSuggestions', (done) => {
    getGenericWords({ keyword: 'meru' })
      .then((genericWordsRes) => {
        expect(genericWordsRes.status).to.equal(200);
        updateGenericWord(genericWordsRes.body[0].id, genericWordWithNestedExampleSuggestionData)
          .then((genericWordRes) => {
            expect(genericWordRes.status).to.equal(200);
            const nestedExampleSuggestion = genericWordRes.body.examples[0];
            deleteGenericWord(genericWordRes.body.id)
              .then((deleteGenericWordRes) => {
                expect(deleteGenericWordRes.status).to.equal(200);
                Promise.all([
                  getGenericWord(genericWordRes.body.id),
                  getExampleSuggestion(nestedExampleSuggestion.id),
                ])
                  .then((res) => {
                    forEach(res, ({ status, body }) => {
                      expect(status).to.equal(400);
                      expect(body.error).to.not.equal(undefined);
                    });
                    done();
                  });
              });
          });
      });
  });
});
