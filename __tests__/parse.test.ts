import { expect } from '@jest/globals';
import fs from 'fs';
import { keys } from 'lodash';
import replaceAbbreviations from '../src/shared/utils/replaceAbbreviations';
import { searchTerm, searchMockedTerm } from './shared/commands';

const mocksDir = `${__dirname}/__mocks__`;
if (!fs.existsSync(mocksDir)) {
  fs.mkdirSync(mocksDir);
}

describe('Parse', () => {
  describe('Dictionaries', () => {
    it('should create dictionaries', async () => {
      await import('../src/dictionaries/buildDictionaries').catch((err) => {
        throw err;
      });
    });

    it('should keep same-cell text in the definition property', async () => {
      const keyword = 'ama';
      const res = await searchTerm(keyword);
      expect(res.status).toEqual(200);
      expect(keys(res.body).length).toBeGreaterThanOrEqual(2);
      expect(res.body[keyword][0].definitions.length).toBeGreaterThanOrEqual(1);
      expect(res.body[keyword][0].examples).toHaveLength(1);
    });

    it('should include the correct A. B. text for ewu chī', async () => {
      const keyword = 'chi';
      const {
        body: { chi: res },
      } = await searchTerm(keyword);
      const termDefinitions = res[0].definitions;
      expect(termDefinitions.length).toBeGreaterThanOrEqual(2);
    });

    it('should include all words -kwù-', async () => {
      const keyword = '-kwù-';
      const res = await searchTerm(keyword);
      expect(res.status).toEqual(200);
      expect(keys(res.body).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Utils', () => {
    describe('Regex Search', () => {
      it('should return term information without included dashes', async () => {
        const res = searchMockedTerm('bia');
        keys(res).forEach((key) => {
          expect(key.charAt(0)).toEqual('b');
        });
      });

      it('should return term with apostrophe by using spaces', async () => {
        const res = searchMockedTerm('n oge');
        expect(keys(res)[0]).toEqual("n'oge");
      });

      it('should return term with space with non word characters', async () => {
        const res = searchMockedTerm('n oge');
        expect(keys(res)[0]).toEqual("n'oge");
      });

      it('should return term with apostrophe by using apostrophe', async () => {
        const res = searchMockedTerm('ànì');
        expect(keys(res)[0]).toEqual('ànì');
      });

      it('should return all matching terms', async () => {
        const keyword = 'be';
        const res = await searchTerm(keyword);
        expect(res.status).toEqual(200);
        expect(keys(res.body).length).toBeGreaterThanOrEqual(6);
      });
    });

    describe('Abbreviations', () => {
      it('should replace all present valid abbreviations', async () => {
        const withAbbreviations = 'n. noun. num. num.eral aux. v. aux.v. infl. suff.';
        const withoutAbbreviations = replaceAbbreviations(withAbbreviations);
        expect(withoutAbbreviations).toEqual(
          'noun noun. numeral num.eral auxiliary verb aux.verb inflectional suffix'
        );
      });
    });
  });
});
