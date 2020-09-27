import fs from 'fs';
import { LONG_TIMEOUT } from './shared/constants';

const mocksDir = `${__dirname}/../tests/__mocks__`;
if (!fs.existsSync(mocksDir)){
    fs.mkdirSync(mocksDir);
}

describe('Parse', () => {
    describe('Dictionaries', function() {
        this.timeout(LONG_TIMEOUT);
        it('should create dictionaries', (done) => {
            import('../ig/parseAndBuild').then(() => {
                done();
            }).catch((err) => {
                throw err;
            })
        })
    })
})