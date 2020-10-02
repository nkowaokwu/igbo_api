import fs from 'fs';
import chai from 'chai';
import rimraf from 'rimraf';
import { keys } from 'lodash';
import { LONG_TIMEOUT } from './shared/constants';
import { DICTIONARIES_DIR } from '../shared/constants/parseFileLocations';
import { searchTerm, searchMockedTerm } from './shared/commands';
import replaceAbbreviations from '../shared/utils/replaceAbbreviations';

const { expect } = chai;
const mocksDir = `${__dirname}/../tests/__mocks__`;
if (!fs.existsSync(mocksDir)){
    fs.mkdirSync(mocksDir);
}

describe('Parse', () => {
    describe('Dictionaries', function() {
        this.timeout(LONG_TIMEOUT);
        it('should create dictionaries', (done) => {
            import('../dictionaries/parseAndBuild').then(() => {
                setTimeout(() => done(), 1000);
            }).catch((err) => {
                throw err;
            });
        });

        it('should keep same-cell text in the definition property', (done) => {
            const keyword = 'ama';
            searchTerm(keyword)
            .end((_, res) => {
                expect(res.status).to.equal(200);
                expect(keys(res.body).length).to.be.greaterThan(2);
                expect(res.body[keyword]).to.be.an('array');
                expect(res.body[keyword][0].definitions.length).to.be.at.least(1);
                expect(res.body[keyword][0].examples.length).to.equal(1);
                done();
            });
        });

        it('should include phrases for zu-zo', (done) => {
            const keyword = 'zu-zo';
            searchTerm(keyword)
            .end((_, res) => {
                expect(res.status).to.equal(200);
                expect(res.body['-zu-zò']).to.exist;
                expect(keys(res.body['-zu-zò'][0].phrases).length).to.be.at.least(1);
                done();
            });
        });

        it('should include the correct definition text for ewu chī', (done) => {
            const keyword = 'chi';
            const phraseKeyword = 'ewu chī';
            searchTerm(keyword)
            .end((_, { body: { chi: res }}) => {
                const termPhraseDefinitions = res[0].phrases[phraseKeyword].definitions;
                const expectedDefinition = `a goat given to one's mother for her personal chi, which must never be killed`;
                expect(termPhraseDefinitions.length).to.be.at.least(1);
                expect(termPhraseDefinitions[0]).to.equal(expectedDefinition);
                done();
            });
        });

        it('should include the correct A. B. text for ewu chī', (done) => {
            const keyword = 'chi';
            searchTerm(keyword)
            .end((_, { body: { chi: res }}) => {
                const termDefinitions = res[0].definitions;
                expect(termDefinitions.length).to.be.at.least(2);
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
    
            it('should return term with apostrophe by using apostrophe', (done) => {
                const res = searchMockedTerm("n'oge");
                expect(res).to.be.an('object');
                expect(keys(res)[0]).to.equal("n'oge");
                done();
            });
        });

        describe('Abbreviations', () => {
            it('should replace all present valid abbreviations', (done) => {
                const withAbbreviations = 'n. noun. num. num.eral aux. v. aux.v. infl. suff.';
                const withoutAbbreviations = replaceAbbreviations(withAbbreviations);
                expect(withoutAbbreviations).to.equal('noun noun. numeral num.eral auxiliary verb aux.verb inflectional suffix');
                done();
            })
        })
    })

    after((done) => {
        rimraf(DICTIONARIES_DIR, () => done());
    });
});