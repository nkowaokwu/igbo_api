import fs from 'fs';
import chai from 'chai';
import rimraf from 'rimraf';
import { LONG_TIMEOUT } from './shared/constants';
import { DICTIONARIES_DIR } from '../shared/constants/parseFileLocations';
import { searchMockedTerm } from './shared/commands';

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
            const res = searchMockedTerm('ama');
            expect(res).to.exist;
            expect(res).to.be.an('object');
            expect(res).to.have.key('ama');
            expect(res.ama).to.be.an('array');
            done();
        });
    });

    after((done) => {
        rimraf(DICTIONARIES_DIR, () => done());
    });
});