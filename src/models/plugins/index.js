/* Code from https://stackoverflow.com/a/30435676 */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';

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
