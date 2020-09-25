import fs from 'fs';
import chai from 'chai';

const { expect } = chai;

const mocksDir = `${__dirname}/../tests/__mocks__`;
if (!fs.existsSync(mocksDir)){
    fs.mkdirSync(mocksDir);
}

describe('Parse', () => {
    describe('Dictionaries', () => {
        it('should create dictionaries', (done) => {
            import('../ig/parse').then(() => {
                done();
            }).catch((err) => {
                throw err;
            })
        })
    })
})