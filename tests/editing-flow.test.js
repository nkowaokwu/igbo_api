import chai from 'chai';
import { forEach, uniq } from 'lodash';
import {
  createWord,
  deleteGenericWord,
  deleteWordSuggestion,
  getExample,
  getGenericWord,
  getGenericWords,
  getWord,
  getWordSuggestion,
  getExamples,
  getExampleSuggestion,
  suggestNewWord,
  suggestNewExample,
  updateGenericWord,
  updateWordSuggestion,
} from './shared/commands';
import {
  exampleSuggestionData,
  genericWordData,
  genericWordWithNestedExampleSuggestionData,
  wordSuggestionData,
  wordSuggestionWithNestedExampleSuggestionData,
} from './__mocks__/documentData';
import { AUTH_TOKEN, SAVE_DOC_DELAY } from './shared/constants';
import { createExampleFromSuggestion } from './shared/utils';

const { expect } = chai;

describe('Editing Flow', () => {
  it('should create a new wordSuggestion and then merge', (done) => {
    suggestNewWord(wordSuggestionData)
      .then((wordSuggestionRes) => {
        expect(wordSuggestionRes.status).to.equal(200);
        createWord(wordSuggestionRes.body.id)
          .then((mergedWordRes) => {
            expect(mergedWordRes.status).to.equal(200);
            getWordSuggestion(wordSuggestionRes.body.id)
              .end((_, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
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
        createWord(genericWordRes.body.id)
          .then((mergedWordRes) => {
            expect(mergedWordRes.status).to.equal(200);
            getWordSuggestion(genericWordRes.body.id)
              .end((_, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
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

  it('should create a new wordSuggestion with a nested exampleSuggestion then merge', function (done) {
    this.timeout(15000);
    suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
      .then((suggestionRes) => {
        expect(suggestionRes.status).to.equal(200);
        createWord(suggestionRes.body.id)
          .then((mergedWordRes) => {
            expect(mergedWordRes.status).to.equal(200);
            setTimeout(() => {
              getWord(mergedWordRes.body.id)
                .then((wordRes) => {
                  const mergedWord = wordRes.body;
                  const nestedExample = mergedWord.examples[0];
                  getExample(nestedExample.id)
                    .then((exampleRes) => {
                      getWordSuggestion(suggestionRes.body.id)
                        .end((_, wordSuggestionRes) => {
                          const mergedExample = exampleRes.body;
                          const wordSuggestion = wordSuggestionRes.body;
                          expect(mergedExample.associatedWords).includes(mergedWord.id);
                          expect(wordSuggestion.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
                          expect(wordSuggestion.merged).to.equal(mergedWord.id);
                          expect(mergedWord.examples[0].associatedWords).includes(mergedWord.id);
                          expect(mergedWord.examples[0].id).equal(mergedExample.id);
                          done();
                        });
                    });
                });
            }, SAVE_DOC_DELAY);
          });
      });
  });

  it('should add a new associatedWordId to exampleSuggestion', function (done) {
    this.timeout(15000);
    suggestNewWord(wordSuggestionData)
      .then((res) => {
        createWord(res.body.id)
          .then((firstWordRes) => {
            expect(firstWordRes.status).to.equal(200);
            suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
              .then((wordSuggestionRes) => {
                expect(wordSuggestionRes.status).to.equal(200);
                createWord(wordSuggestionRes.body.id)
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
                          createExampleFromSuggestion(newExampleSuggestion)
                            .then(() => {
                              done();
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
        createWord(genericWordRes.body.id)
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
                      expect(wordSuggestion.mergedBy).to.equal(AUTH_TOKEN.ADMIN_AUTH_TOKEN);
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

  it('should delete a new wordSuggestion with a nested exampleSuggestions', function (done) {
    this.timeout(15000);
    suggestNewWord(wordSuggestionWithNestedExampleSuggestionData)
      .then((wordSuggestionRes) => {
        expect(wordSuggestionRes.status).to.equal(200);
        const nestedExampleSuggestion = wordSuggestionRes.body.examples[0];
        deleteWordSuggestion(wordSuggestionRes.body.id)
          .then((deleteWordSuggestionRes) => {
            expect(deleteWordSuggestionRes.status).to.equal(200);
            getWordSuggestion(wordSuggestionRes.body.id)
              .then((res) => {
                expect(res.status).to.equal(404);
                expect(res.body.error).to.not.equal(undefined);
                getExampleSuggestion(nestedExampleSuggestion.id)
                  .end((_, result) => {
                    expect(result.status).to.equal(404);
                    expect(result.body.error).to.not.equal(undefined);
                    done();
                  });
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
        updateWordSuggestion(updatedWordSuggestion)
          .end((_, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.word).to.equal('newWord');
            done();
          });
      });
  });

  it('should not allow duplicate associated word ids for nested exampleSuggestions', (done) => {
    const igbo = 'IGBO TEXT';
    const english = 'ENGLISH TEXT';
    getGenericWords()
      .then((genericWordsRes) => {
        expect(genericWordsRes.status).to.equal(200);
        const genericWord = genericWordsRes.body[0];
        genericWord.wordClass = 'wordClass';
        genericWord.examples = [{
          igbo,
          english,
          associatedWords: [genericWordsRes.body[0].id],
        }];
        updateGenericWord(genericWord)
          .then((updatedGenericWordRes) => {
            expect(updatedGenericWordRes.status).to.equal(200);
            createWord(genericWord.id)
              .then((firstWordRes) => {
                expect(firstWordRes.status).to.equal(200);
                setTimeout(() => {
                  getExamples({ keyword: igbo })
                    .then((firstExampleRes) => {
                      expect(firstExampleRes.status).to.equal(200);
                      const updatingGenericWord = { ...updatedGenericWordRes.body };
                      const firstExample = { ...firstExampleRes.body[0] };
                      firstExample.originalExampleId = firstExample.id;
                      delete firstExample.id;
                      updatingGenericWord.originalWordId = firstWordRes.body.id;
                      updatingGenericWord.examples = [firstExample];
                      suggestNewWord(updatingGenericWord)
                        .then((secondGenericWordRes) => {
                          expect(secondGenericWordRes.status).to.equal(200);
                          setTimeout(() => {
                            createWord(secondGenericWordRes.body.id)
                              .then((secondWordRes) => {
                                expect(secondWordRes.status).to.equal(200);
                                getExample(secondWordRes.body.examples[0].id)
                                  .end((_, res) => {
                                    expect(res.status).to.equal(200);
                                    expect(res.body.associatedWords.length)
                                      .to.equal(uniq(res.body.associatedWords).length);
                                    done();
                                  });
                              }, SAVE_DOC_DELAY);
                          });
                        });
                    });
                }, SAVE_DOC_DELAY);
              });
          });
      });
  });

  it.skip('should delete a new genericWord with a nested exampleSuggestions', (done) => {
    getGenericWords({ keyword: 'meru' })
      .then((genericWordsRes) => {
        expect(genericWordsRes.status).to.equal(200);
        updateGenericWord({ id: genericWordsRes.body[0].id, ...genericWordWithNestedExampleSuggestionData })
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
