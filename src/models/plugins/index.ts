/* Code from https://stackoverflow.com/a/30435676 */
/* Code from https://stackoverflow.com/q/30431262 */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';

/* Replaces the _id key with id */
export const toJSONPlugin = (schema: mongoose.Schema) => {
  const toJSON = schema.methods.toJSON || mongoose.Document.prototype.toJSON;
  schema.set('toJSON', {
    virtuals: true,
  });
  // eslint-disable-next-line func-names
  schema.methods.toJSON = function () {
    const json = toJSON.apply(this);
    delete json._id;
    delete json.__t;
    delete json.__v;
    return json;
  };
};

export const toObjectPlugin = {
  transform: (doc: mongoose.Document, ret: mongoose.Document) => {
    // remove the _id and __v of every document before returning the result
    ret.id = doc.id.toString();
    delete ret._id;
    delete ret.__v;
  },
};
