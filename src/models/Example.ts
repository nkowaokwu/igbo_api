import mongoose from 'mongoose';
import { toJSONPlugin, toObjectPlugin } from './plugins';
import ExampleStyles from '../shared/constants/ExampleStyles';
import SentenceTypes from '../shared/constants/SentenceTypes';
import LanguageEnum from '../shared/constants/LanguageEnum';

const { Schema, Types } = mongoose;

const languageSuggestionSchema = new Schema({
  language: { type: String, enum: Object.values(LanguageEnum), default: LanguageEnum.UNSPECIFIED },
  text: { type: String, default: '', trim: true },
  pronunciations: {
    type: [
      {
        audio: { type: String, default: '' },
        speaker: { type: String, default: '' },
      },
    ],
    default: [],
  },
});

export const exampleSchema = new Schema(
  {
    source: {
      type: languageSuggestionSchema,
      default: { language: LanguageEnum.UNSPECIFIED, text: '' },
    },
    translations: { type: [{ type: languageSuggestionSchema }], default: [] },
    meaning: { type: String, default: '' },
    nsibidi: { type: String, default: '' },
    type: {
      type: String,
      enum: Object.values(SentenceTypes),
      default: SentenceTypes.DEFAULT,
    },
    style: {
      type: String,
      enum: Object.values(ExampleStyles).map(({ value }) => value),
      default: ExampleStyles.NO_STYLE.value,
    },
    associatedWords: { type: [{ type: Types.ObjectId, ref: 'Word' }], default: [] },
    associatedDefinitionsSchemas: { type: [{ type: Types.ObjectId }], default: [] },
  },
  { toObject: toObjectPlugin, timestamps: true }
);

exampleSchema.index({
  associatedWords: 1,
});
exampleSchema.index({
  source: 1,
});
exampleSchema.index({
  translations: 1,
});

toJSONPlugin(exampleSchema);
