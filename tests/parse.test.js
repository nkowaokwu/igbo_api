import fs from 'fs';
import chai from 'chai';
import rimraf from 'rimraf';
import { keys } from 'lodash';
import { DICTIONARIES_DIR } from '../src/shared/constants/parseFileLocations';
import replaceAbbreviations from '../src/shared/utils/replaceAbbreviations';
import { searchTerm, searchMockedTerm } from './shared/commands';

const { expect } = chai;
const mocksDir = `${__dirname}/__mocks__`;
if (!fs.existsSync(mocksDir)) {
  fs.mkdirSync(mocksDir);
}

describe('Parse', () => {
  describe('Dictionaries', () => {
    it('should create dictionaries', (done) => {
      import('../src/dictionaries/buildDictionaries')
        .then(() => {
          setTimeout(() => done(), 1000);
        })
        .catch((err) => {
          throw err;
        });
    });

    it('should keep same-cell text in the definition property', (done) => {
      const keyword = 'ama';
      searchTerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(keys(res.body)).to.have.lengthOf.at.least(2);
        expect(res.body[keyword]).to.be.an('array');
        expect(res.body[keyword][0].definitions).to.have.lengthOf.at.least(1);
        expect(res.body[keyword][0].examples).to.have.lengthOf(1);
        done();
      });
    });

    it('should include the correct A. B. text for ewu chī', (done) => {
      const keyword = 'chi';
      searchTerm(keyword).end((_, { body: { chi: res } }) => {
        const termDefinitions = res[0].definitions;
        expect(termDefinitions).to.have.lengthOf.at.least(2);
        done();
      });
    });

    it('should include all words -kwù-', (done) => {
      const keyword = '-kwù-';
      searchTerm(keyword).end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body[keyword]).to.be.an('array');
        expect(keys(res.body)).to.have.lengthOf.at.least(1);
        done();
      });
    });
  });

  describe('Utils', () => {
    describe('Regex Search', () => {
      it('should return term information without included dashes', (done) => {
        const res = searchMockedTerm('bia');
        expect(res).to.be.an('object');
        keys(res).forEach((key) => {
          expect(key.charAt(0)).to.equal('-');
        });
        done();
      });

      it('should return term with apostrophe by using spaces', (done) => {
        const res = searchMockedTerm('n oge');
        expect(res).to.be.an('object');
        expect(keys(res)[0]).to.equal("n'oge");
        done();
      });

      it('should return term with space with non word characters', (done) => {
        const res = searchMockedTerm('n oge');
        expect(res).to.be.an('object');
        expect(keys(res)[0]).to.equal("n'oge");
        done();
      });

      it('should return term with apostrophe by using apostrophe', (done) => {
        const res = searchMockedTerm('ànì');
        expect(res).to.be.an('object');
        expect(keys(res)[0]).to.equal('ànì');
        done();
      });

      it('should return all matching terms', (done) => {
        const keyword = 'be';
        searchTerm(keyword).end((_, res) => {
          expect(res.status).to.equal(200);
          expect(keys(res.body)).to.have.lengthOf.at.least(6);
          done();
        });
      });
    });

    describe('Abbreviations', () => {
      it('should replace all present valid abbreviations', (done) => {
        const withAbbreviations = 'n. noun. num. num.eral aux. v. aux.v. infl. suff.';
        const withoutAbbreviations = replaceAbbreviations(withAbbreviations);
        expect(withoutAbbreviations).to.equal(
          'noun noun. numeral num.eral auxiliary verb aux.verb inflectional suffix',
        );
        done();
      });
    });
  });

  after((done) => {
    rimraf(DICTIONARIES_DIR, () => done());
  });
});
