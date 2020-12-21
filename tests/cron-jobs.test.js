import chai from 'chai';
import chaiHttp from 'chai-http';
import { getExampleSuggestionsFromLastWeek } from '../src/controllers/exampleSuggestions';
import { getWordSuggestionsFromLastWeek } from '../src/controllers/wordSuggestions';
import { createWord, sendEmailJob } from './shared/commands';
import { createExampleFromSuggestion, createWordFromSuggestion } from './shared/utils';
import { exampleSuggestionData, wordSuggestionData } from './__mocks__/documentData';

const { expect } = chai;

chai.use(chaiHttp);

describe('Automated Cron Jobs', () => {
  it('should send an email to all editors, mergers, and admins for merged stats', (done) => {
    sendEmailJob()
      .end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.message).to.not.equal(undefined);
        done();
      });
  });

  it('should get the correct words and examples to include in email', (done) => {
    createExampleFromSuggestion(exampleSuggestionData)
      .then(() => {
        createWordFromSuggestion(wordSuggestionData)
          .then((wordSuggestion) => {
            createWord(wordSuggestion.id)
              .then(async () => {
                const wordSuggestions = await getWordSuggestionsFromLastWeek();
                const exampleSuggestions = await getExampleSuggestionsFromLastWeek();
                expect(wordSuggestions).to.have.lengthOf.at.least(1);
                expect(exampleSuggestions).to.have.lengthOf.at.least(1);
                done();
              });
          });
      });
  });
});
