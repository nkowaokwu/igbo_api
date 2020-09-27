import fs from 'fs';
import rimraf from 'rimraf';
import { LONG_TIMEOUT } from './shared/constants';
import { DICTIONARIES_DIR } from '../shared/constants/parseFileLocations';

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
    });

    after((done) => {
        rimraf(DICTIONARIES_DIR, () => done());
    });
});