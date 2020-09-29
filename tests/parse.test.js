import fs from 'fs';
import chai from 'chai';
import rimraf from 'rimraf';
import { keys } from 'lodash';
import { LONG_TIMEOUT } from './shared/constants';
import { DICTIONARIES_DIR } from '../shared/constants/parseFileLocations';
import { searchTerm } from './shared/commands';

const { expect } = chai;
const mocksDir = `${__dirname}/../tests/__mocks__`;
if (!fs.existsSync(mocksDir)){
    fs.mkdirSync(mocksDir);
}

describe('Parse', () => {
    describe('Dictionaries', function() {
        this.timeout(LONG_TIMEOUT);
        it('should create dictionaries', (done) => {
            import('../ig/parseAndBuild').then(() => {
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
                expect(res.body[keyword][0].definition.length).to.be.greaterThan(20);
                expect(res.body[keyword][0].examples.length).to.equal(1);
                done();
            })
        });

        it('should include phrases for zu-zo', (done) => {
            const keyword = 'zu-zo';
            searchTerm(keyword)
            .end((_, res) => {
                expect(res.status).to.equal(200);
                expect(res.body['-zu-zò']).to.exist;
                expect(keys(res.body['-zu-zò'][0].phrases).length).to.be.at.least(1);
                done();
            })
        });
    });

    after((done) => {
        rimraf(DICTIONARIES_DIR, () => done());
    });
});