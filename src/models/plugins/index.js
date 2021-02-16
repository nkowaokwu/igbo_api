/* eslint-disable func-names */
/* Code from https://stackoverflow.com/a/30435676 */
/* Code from https://stackoverflow.com/q/30431262 */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { map, keys } from 'lodash';
import mongoose from 'mongoose';
import accents from 'remove-accents';
import wordClass from '../../shared/constants/wordClass';

/* Replaces the _id key with id */
export const toJSONPlugin = (schema) => {
  const toJSON = schema.methods.toJSON || mongoose.Document.prototype.toJSON;
  schema.set('toJSON', {
    virtuals: true,
  });
  schema.methods.toJSON = function () {
    const json = toJSON.apply(this);
    delete json._id;
    delete json.__t;
    delete json.__v;
    return json;
  };
};

export const toObjectPlugin = ({
  transform: (doc, ret) => {
    // remove the _id and __v of every document before returning the result
    ret.id = doc.id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export const updatedOnHook = (schema) => (
  schema.pre('save', function () {
    this.updatedOn = Date.now();
    return this;
  })
);

/* Removes accent marks found in the word field before sending to client */
export const normalizeWordHook = (schema) => {
  schema.post('find', (docs) => (
    map(docs, (doc) => {
      doc.word = accents.remove(doc.word);
      return doc;
    })
  ));
  schema.post('findOne', (doc) => {
    doc.word = accents.remove(doc.word);
    return doc;
  });
};

/* Removes accent marks found in the igbo text before sending to client */
export const normalizeExampleHook = (schema) => {
  schema.post('find', (docs) => (
    map(docs, (doc) => {
      doc.igbo = accents.remove(doc.igbo);
      return doc;
    })
  ));
  schema.post('findOne', (doc) => {
    if (doc) {
      doc.igbo = accents.remove(doc?.igbo || '');
    }
    return doc;
  });
};

/* Validates word class field before saving to the database */
export const wordClassValidationHook = (schema) => (
  schema.pre('save', function () {
    if (!keys(wordClass).includes(this.wordClass)) {
      // throw new Error('invalid word class specified');
      return new Promise((resolve, reject) => {
        reject(new Error('invalid word class specified'));
      });
    }

    return this;
  })
);
