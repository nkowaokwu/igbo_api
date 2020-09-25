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
                const dictionaries = [
                    `${mocksDir}/dictionaries/ig-en_expanded.json`,
                    `${mocksDir}/dictionaries/ig-en_normalized_expanded.json`,
                    `${mocksDir}/dictionaries/ig-en_normalized.json`,
                    `${mocksDir}/dictionaries/ig-en.json`,
                ]
                const allFilesExist = dictionaries.every((dictionary) => fs.existsSync(dictionary));
                expect(allFilesExist).to.be.equal(true);
                done();
            });
        })
    })
})