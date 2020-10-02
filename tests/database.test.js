import chai from 'chai';
import mongoose from 'mongoose';
import { keys } from 'lodash';
import { LONG_TIMEOUT } from './shared/constants';
import Word from '../models/Word';
import { populateAPI } from './shared/commands';

const { expect } = chai;
const { ObjectId } = mongoose.Types;

describe('Database', () => {
    describe('/POST mongodb words', function() {
        this.timeout(LONG_TIMEOUT);
        it('should populate mongodb with words', (done) => {
            const wordData = {
                word: 'word',
                wordClass: 'n.',
                definitions: ['first definition', 'second definition'],
                examples: [new ObjectId(), new ObjectId()],
                phrases: new ObjectId(),
            };
            const validWord = new Word(wordData);
            validWord.save()
            .then((savedWord) => {
                expect(savedWord.id).to.exist;
                expect(savedWord.word).to.equal('word');
                expect(savedWord.wordClass).to.equal('n.');
                done();
            });
        });

        it('should throw an error for invalid data', (done) => {
            const wordData = {
                word: 'word',
                wordClass: 'n.',
                definitions: ['first definition', 'second definition'],
                examples: ['first example'],
                phrases: new ObjectId(),
            };
            const validWord = new Word(wordData);
            validWord.save()
                .catch((err) => {
                    expect(err).to.exist;
                    done();
                });
        });

        it('should seed mongodb database', (done) => {
            populateAPI()
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(err).to.not.exist;
                expect(res.body).to.be.an('object');
                expect(keys(res.body).length).to.equal(0);
                done();
            });
        });
    });
});